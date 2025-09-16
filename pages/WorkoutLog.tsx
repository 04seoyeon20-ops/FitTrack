import React, { useState, useMemo, useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import { Workout, WorkoutExercise, SetDetail } from '../types';
import { initialExerciseCategories, initialExercisesData } from '../data/exercises';
import { mockWorkouts } from '../data/mockData';
import { PlusCircleIcon, TrashIcon, PencilIcon, XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from '../components/Icons';

const WorkoutLog: React.FC = () => {
    const [workouts, setWorkouts] = useState<Workout[]>(mockWorkouts);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentWorkout, setCurrentWorkout] = useState<Workout | null>(null);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    
    // Exercise list state management
    const [exerciseData, setExerciseData] = useState<Record<string, string[]>>({});
    const [exerciseCategories, setExerciseCategories] = useState<string[]>([]);
    const [isAddingNewExercise, setIsAddingNewExercise] = useState(false);
    const [newExerciseName, setNewExerciseName] = useState('');

    useEffect(() => {
        const savedExercises = localStorage.getItem('userExercises');
        const savedCategories = localStorage.getItem('userExerciseCategories');

        if (savedExercises && savedCategories) {
            setExerciseData(JSON.parse(savedExercises));
            setExerciseCategories(JSON.parse(savedCategories));
        } else {
            setExerciseData(initialExercisesData);
            setExerciseCategories(initialExerciseCategories);
        }
    }, []);

    useEffect(() => {
        if (Object.keys(exerciseData).length > 0) {
            localStorage.setItem('userExercises', JSON.stringify(exerciseData));
            localStorage.setItem('userExerciseCategories', JSON.stringify(exerciseCategories));
        }
    }, [exerciseData, exerciseCategories]);


    const workoutDates = useMemo(() => new Set(workouts.map(w => w.date)), [workouts]);

    const filteredWorkouts = useMemo(() => {
        if (!selectedDate) {
            return workouts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        }
        return workouts.filter(w => w.date === selectedDate);
    }, [workouts, selectedDate]);

    const openModal = (workout?: Workout) => {
        if (workout) {
            setCurrentWorkout(JSON.parse(JSON.stringify(workout)));
        } else {
            setCurrentWorkout({
                id: `w${Date.now()}`,
                date: new Date().toISOString().split('T')[0],
                name: '',
                exercises: []
            });
        }
        setIsAddingNewExercise(false);
        setNewExerciseName('');
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentWorkout(null);
    };

    const handleSave = () => {
        if (!currentWorkout) return;
        const existingIndex = workouts.findIndex(w => w.id === currentWorkout.id);
        if (existingIndex > -1) {
            const updatedWorkouts = [...workouts];
            updatedWorkouts[existingIndex] = currentWorkout;
            setWorkouts(updatedWorkouts);
        } else {
            setWorkouts([currentWorkout, ...workouts]);
        }
        closeModal();
    };

    const handleDelete = (workoutId: string) => {
        setWorkouts(workouts.filter(w => w.id !== workoutId));
    };

    const handleWorkoutChange = (field: keyof Workout, value: any) => {
        if (!currentWorkout) return;
        setCurrentWorkout({ ...currentWorkout, [field]: value });
    };

    const addExercise = (exerciseName: string) => {
        if (!currentWorkout || !exerciseName) return;
        const newExercise: WorkoutExercise = {
            id: `e${Date.now()}`,
            name: exerciseName,
            sets: [{ id: `s${Date.now()}`, weight: 0, reps: 0 }]
        };
        setCurrentWorkout({ ...currentWorkout, exercises: [...currentWorkout.exercises, newExercise] });
    };

    const handleAddNewExercise = () => {
        const trimmedName = newExerciseName.trim();
        if (!trimmedName) {
            alert('운동 이름을 입력해주세요.');
            return;
        }

        const allExercises = Object.values(exerciseData).flat();
        if (allExercises.map(e => e.toLowerCase()).includes(trimmedName.toLowerCase())) {
            alert('이미 존재하는 운동입니다.');
            return;
        }

        const newCategory = '사용자 정의';

        setExerciseData(prevData => {
            const newData = { ...prevData };
            if (!newData[newCategory]) {
                newData[newCategory] = [];
            }
            newData[newCategory].push(trimmedName);
            return newData;
        });

        if (!exerciseCategories.includes(newCategory)) {
            setExerciseCategories(prev => [...prev, newCategory]);
        }
        
        addExercise(trimmedName);

        setNewExerciseName('');
        setIsAddingNewExercise(false);
    };


    const removeExercise = (exerciseId: string) => {
        if (!currentWorkout) return;
        setCurrentWorkout({ ...currentWorkout, exercises: currentWorkout.exercises.filter(e => e.id !== exerciseId) });
    };

    const addSet = (exerciseId: string) => {
        if (!currentWorkout) return;
        const updatedExercises = currentWorkout.exercises.map(ex => {
            if (ex.id === exerciseId) {
                const newSet: SetDetail = { id: `s${Date.now()}`, weight: 0, reps: 0 };
                return { ...ex, sets: [...ex.sets, newSet] };
            }
            return ex;
        });
        setCurrentWorkout({ ...currentWorkout, exercises: updatedExercises });
    };

    const removeSet = (exerciseId: string, setId: string) => {
        if (!currentWorkout) return;
        const updatedExercises = currentWorkout.exercises.map(ex => {
            if (ex.id === exerciseId) {
                return { ...ex, sets: ex.sets.filter(s => s.id !== setId) };
            }
            return ex;
        });
        setCurrentWorkout({ ...currentWorkout, exercises: updatedExercises });
    };

    const handleSetChange = (exerciseId: string, setId: string, field: keyof SetDetail, value: number) => {
        if (!currentWorkout) return;
        const updatedExercises = currentWorkout.exercises.map(ex => {
            if (ex.id === exerciseId) {
                const updatedSets = ex.sets.map(s => {
                    if (s.id === setId) {
                        return { ...s, [field]: value };
                    }
                    return s;
                });
                return { ...ex, sets: updatedSets };
            }
            return ex;
        });
        setCurrentWorkout({ ...currentWorkout, exercises: updatedExercises });
    };
    
    const renderCalendar = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
        const today = new Date();

        const cells = [];
        // Fill empty cells for days before the 1st of the month
        for (let i = 0; i < firstDayOfMonth; i++) {
            cells.push(<div key={`empty-${i}`} className="w-full aspect-square"></div>);
        }
    
        // Fill cells for each day of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
            const isSelected = dateStr === selectedDate;
            const hasWorkout = workoutDates.has(dateStr);
    
            cells.push(
                <div key={day} className="flex justify-center items-center w-full aspect-square">
                    <button
                        onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                        className={`relative w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-colors text-sm sm:text-base ${
                            isSelected ? 'bg-blue-600 text-white font-bold' : isToday ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
                        }`}
                    >
                        {day}
                        {hasWorkout && <div className={`absolute bottom-1 w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-blue-500'}`}></div>}
                    </button>
                </div>
            );
        }
    
        return (
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md mb-6">
                <div className="flex items-center justify-between mb-4">
                    <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))} className="p-2 rounded-full hover:bg-gray-100">
                        <ChevronLeftIcon className="w-6 h-6" />
                    </button>
                    <h2 className="text-lg sm:text-xl font-bold">{`${year}년 ${month + 1}월`}</h2>
                    <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))} className="p-2 rounded-full hover:bg-gray-100">
                        <ChevronRightIcon className="w-6 h-6" />
                    </button>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center text-xs sm:text-sm text-gray-500 mb-2">
                    {daysOfWeek.map(day => <div key={day}>{day}</div>)}
                </div>
                <div className="grid grid-cols-7 gap-1">
                    {cells}
                </div>
            </div>
        );
    };

    return (
        <div>
            <PageHeader title="운동 기록" subtitle="캘린더로 운동 기록을 확인하고, 성장을 추적하세요." />

            {renderCalendar()}

            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
                <div>
                {selectedDate && (
                     <div className="flex items-center gap-2">
                         <span className="font-bold text-lg">{new Date(selectedDate).toLocaleDateString('ko-KR')} 기록</span>
                         <button onClick={() => setSelectedDate(null)} className="text-sm text-blue-600 hover:underline">(모든 기록 보기)</button>
                     </div>
                 )}
                </div>
                <button
                    onClick={() => openModal()}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <PlusCircleIcon className="w-5 h-5" />
                    새 운동 기록하기
                </button>
            </div>

            <div className="space-y-6">
                {filteredWorkouts.length > 0 ? filteredWorkouts.map(workout => (
                    <div key={workout.id} className="p-6 bg-white rounded-xl shadow-md">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">{workout.name}</h2>
                                <p className="text-sm text-gray-500">{new Date(workout.date).toLocaleDateString('ko-KR')}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={() => openModal(workout)} className="p-2 text-gray-500 hover:text-blue-600"><PencilIcon className="w-5 h-5" /></button>
                                <button onClick={() => handleDelete(workout.id)} className="p-2 text-gray-500 hover:text-red-600"><TrashIcon className="w-5 h-5" /></button>
                            </div>
                        </div>
                        <div className="space-y-3">
                            {workout.exercises.map(ex => (
                                <div key={ex.id}>
                                    <h3 className="font-semibold text-gray-700">{ex.name}</h3>
                                    <ul className="pl-4 mt-1 space-y-1 text-sm text-gray-600">
                                        {ex.sets.map((set, index) => (
                                            <li key={set.id}>
                                                <strong>{index + 1}세트:</strong> {set.weight} kg &times; {set.reps} 회
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                )) : (
                    <div className="text-center py-12 bg-white rounded-xl shadow-md">
                        <p className="text-gray-500">{selectedDate ? '선택한 날짜에 운동 기록이 없습니다.' : '운동 기록이 없습니다. 새 기록을 추가해보세요!'}</p>
                    </div>
                )}
            </div>

            {isModalOpen && currentWorkout && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
                        <div className="flex items-center justify-between p-4 border-b">
                            <h3 className="text-xl font-bold">{currentWorkout.id.startsWith('w_') ? '운동 기록 수정' : '새 운동 기록'}</h3>
                            <button onClick={closeModal}><XMarkIcon className="w-6 h-6" /></button>
                        </div>

                        <div className="p-6 overflow-y-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">운동 이름</label>
                                    <input type="text" value={currentWorkout.name} onChange={e => handleWorkoutChange('name', e.target.value)} className="w-full mt-1 border-gray-300 rounded-md shadow-sm" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">날짜</label>
                                    <input type="date" value={currentWorkout.date} onChange={e => handleWorkoutChange('date', e.target.value)} className="w-full mt-1 border-gray-300 rounded-md shadow-sm" />
                                </div>
                            </div>

                            <div className="space-y-4">
                                {currentWorkout.exercises.map(ex => (
                                    <div key={ex.id} className="p-4 border rounded-md">
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="font-semibold">{ex.name}</h4>
                                            <button onClick={() => removeExercise(ex.id)}><TrashIcon className="w-5 h-5 text-red-500" /></button>
                                        </div>
                                        {ex.sets.map((set, index) => (
                                            <div key={set.id} className="flex items-center gap-2 mb-1 flex-wrap">
                                                <span className="font-semibold w-8 text-center">{index + 1}</span>
                                                <input type="number" value={set.weight} onChange={e => handleSetChange(ex.id, set.id, 'weight', +e.target.value)} className="w-20 p-1 border-gray-300 rounded-md" />
                                                <span>kg</span>
                                                <input type="number" value={set.reps} onChange={e => handleSetChange(ex.id, set.id, 'reps', +e.target.value)} className="w-20 p-1 border-gray-300 rounded-md" />
                                                <span>회</span>
                                                <button onClick={() => removeSet(ex.id, set.id)}><XMarkIcon className="w-4 h-4 text-gray-500" /></button>
                                            </div>
                                        ))}
                                        <button onClick={() => addSet(ex.id)} className="mt-2 text-sm text-blue-600">세트 추가</button>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 pt-4 border-t">
                                <label className="block text-sm font-medium text-gray-700 mb-1">운동 추가</label>
                                {isAddingNewExercise ? (
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={newExerciseName}
                                            onChange={(e) => setNewExerciseName(e.target.value)}
                                            placeholder="새 운동 이름"
                                            className="flex-grow border-gray-300 rounded-md shadow-sm"
                                            autoFocus
                                        />
                                        <button onClick={handleAddNewExercise} className="px-3 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700">추가</button>
                                        <button onClick={() => setIsAddingNewExercise(false)} className="px-3 py-2 text-sm text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">취소</button>
                                    </div>
                                ) : (
                                    <select 
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (value === '__add_new__') {
                                                setIsAddingNewExercise(true);
                                            } else if (value) {
                                                addExercise(value);
                                            }
                                            e.target.value = ""; // Reset select after action
                                        }}
                                        className="w-full border-gray-300 rounded-md shadow-sm"
                                    >
                                        <option value="">운동을 선택하세요</option>
                                        {exerciseCategories.map(cat => (
                                            <optgroup label={cat} key={cat}>
                                                {exerciseData[cat]?.map(exName => <option key={exName} value={exName}>{exName}</option>)}
                                            </optgroup>
                                        ))}
                                        <option value="__add_new__" className="font-bold text-blue-600">⊕ 새로운 운동 추가...</option>
                                    </select>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end p-4 border-t bg-gray-50">
                            <button onClick={closeModal} className="px-4 py-2 mr-2 text-gray-700 bg-white border border-gray-300 rounded-md">취소</button>
                            <button onClick={handleSave} className="px-4 py-2 text-white bg-blue-600 rounded-md">저장</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WorkoutLog;
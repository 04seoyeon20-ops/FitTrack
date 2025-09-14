import React, { useMemo, useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import PageHeader from '../components/PageHeader';
import { mockWorkouts } from '../data/mockData';
import { Workout } from '../types';

const Card: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className }) => (
    <div className={`bg-white p-6 rounded-xl shadow-md ${className}`}>
        <h2 className="text-xl font-bold text-gray-800 mb-4">{title}</h2>
        {children}
    </div>
);

// Function to get the start of the week (Monday) for a given date
const getStartOfWeek = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    return new Date(new Date(d.setDate(diff)).setHours(0, 0, 0, 0));
};

const Progress: React.FC = () => {
    const [selectedExercise, setSelectedExercise] = useState<string>('');

    const weeklyVolumeData = useMemo(() => {
        const weeklyVolumes: { [weekStart: string]: number } = {};

        mockWorkouts.forEach(workout => {
            const workoutDate = new Date(workout.date);
            const weekStartDate = getStartOfWeek(workoutDate);
            const weekStartString = weekStartDate.toISOString().split('T')[0];
            
            const workoutVolume = workout.exercises.reduce((totalVol, exercise) => {
                const exerciseVolume = exercise.sets.reduce((vol, set) => vol + (set.weight * set.reps), 0);
                return totalVol + exerciseVolume;
            }, 0);

            if (!weeklyVolumes[weekStartString]) {
                weeklyVolumes[weekStartString] = 0;
            }
            weeklyVolumes[weekStartString] += workoutVolume;
        });

        return Object.entries(weeklyVolumes)
            .map(([week, volume]) => ({
                week: new Date(week).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' }),
                volume,
            }))
            .sort((a, b) => new Date(a.week).getTime() - new Date(b.week).getTime());

    }, [mockWorkouts]);

    const workoutDates = useMemo(() => {
        return new Set(mockWorkouts.map(w => w.date));
    }, [mockWorkouts]);

    const calendarDays = useMemo(() => {
        const days = [];
        const today = new Date();
        for (let i = 89; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            days.push(date);
        }
        return days;
    }, []);

    const uniqueExercises = useMemo(() => {
        const exerciseSet = new Set<string>();
        mockWorkouts.forEach(w => w.exercises.forEach(e => exerciseSet.add(e.name)));
        return Array.from(exerciseSet).sort();
    }, [mockWorkouts]);

    const exerciseProgressData = useMemo(() => {
        if (!selectedExercise) return [];

        return mockWorkouts
            .map(workout => {
                const targetExercise = workout.exercises.find(e => e.name === selectedExercise);
                if (!targetExercise) return null;

                const maxWeight = Math.max(...targetExercise.sets.map(s => s.weight));

                return {
                    date: workout.date,
                    maxWeight: maxWeight,
                };
            })
            .filter(Boolean)
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    }, [mockWorkouts, selectedExercise]);


    return (
        <div>
            <PageHeader title="운동 진행 상황" subtitle="데이터를 통해 성장을 확인하고 동기를 부여받으세요." />

            <div className="grid grid-cols-1 gap-8">
                <Card title="운동 꾸준함 캘린더 (최근 90일)">
                     <div className="grid grid-cols-7 sm:grid-cols-10 md:grid-cols-15 gap-1.5">
                        {calendarDays.map(day => {
                            const dateString = day.toISOString().split('T')[0];
                            const hasWorkout = workoutDates.has(dateString);
                            return (
                                <div 
                                    key={dateString}
                                    className={`w-8 h-8 rounded-md ${hasWorkout ? 'bg-blue-500' : 'bg-gray-200'}`}
                                    title={day.toLocaleDateString('ko-KR')}
                                ></div>
                            );
                        })}
                    </div>
                    <div className="flex items-center gap-4 mt-4 text-sm">
                        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-gray-200"></div><span>운동 안 함</span></div>
                        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-blue-500"></div><span>운동 함</span></div>
                    </div>
                </Card>

                <Card title="주간 총 볼륨 (kg)">
                    <div className="h-80">
                         <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={weeklyVolumeData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="week" />
                                <YAxis />
                                <Tooltip formatter={(value: number) => `${value.toLocaleString()} kg`} />
                                <Legend />
                                <Bar dataKey="volume" name="총 볼륨" fill="#3b82f6" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card title="운동별 성장 그래프">
                    <div>
                        <label htmlFor="exercise-select" className="block text-sm font-medium text-gray-700">운동 선택:</label>
                        <select
                            id="exercise-select"
                            value={selectedExercise}
                            onChange={(e) => setSelectedExercise(e.target.value)}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                        >
                            <option value="">-- 운동을 선택하세요 --</option>
                            {uniqueExercises.map(ex => <option key={ex} value={ex}>{ex}</option>)}
                        </select>
                    </div>

                    <div className="h-80 mt-4">
                        {selectedExercise && exerciseProgressData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={exerciseProgressData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip formatter={(value: number) => `${value} kg`} />
                                    <Legend />
                                    <Line type="monotone" dataKey="maxWeight" name="최대 무게" stroke="#8884d8" activeDot={{ r: 8 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                             <div className="flex items-center justify-center h-full text-gray-500">
                                {selectedExercise ? '선택한 운동에 대한 기록이 없습니다.' : '그래프를 보려면 운동을 선택하세요.'}
                            </div>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Progress;

import React, { useMemo, useState } from 'react';
import PageHeader from '../components/PageHeader';
import { useAuth } from '../contexts/AuthContext';
import Loader from '../components/Loader';
import { Workout } from '../types';
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { mockWorkouts } from '../data/mockData';

const ChartCard: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className = '' }) => (
    <div className={`bg-white p-6 rounded-xl shadow-md ${className}`}>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
        <div className="h-80">
            {children}
        </div>
    </div>
);

const Progress: React.FC = () => {
    const { user, isLoading } = useAuth();
    const workouts: Workout[] = mockWorkouts;
    const [selectedExercise, setSelectedExercise] = useState<string>('');

    const uniqueExercises = useMemo(() => {
        const exerciseSet = new Set<string>();
        workouts.forEach(w => w.exercises.forEach(ex => exerciseSet.add(ex.name)));
        const sorted = Array.from(exerciseSet).sort();
        if (!selectedExercise && sorted.length > 0) {
            setSelectedExercise(sorted[0]);
        }
        return sorted;
    }, [workouts, selectedExercise]);

    const exerciseProgressData = useMemo(() => {
        if (!selectedExercise) return [];
        return workouts
            .map(workout => {
                const targetExercise = workout.exercises.find(ex => ex.name === selectedExercise);
                if (!targetExercise) return null;

                const volume = targetExercise.sets.reduce((sum, set) => sum + (set.weight * set.reps), 0);
                const maxWeight = Math.max(0, ...targetExercise.sets.map(set => set.weight));

                return {
                    date: workout.date.substring(5), // "MM-DD"
                    fullDate: workout.date,
                    volume,
                    maxWeight,
                };
            })
            .filter((item): item is NonNullable<typeof item> => item !== null)
            .sort((a, b) => new Date(a.fullDate).getTime() - new Date(b.fullDate).getTime());
    }, [workouts, selectedExercise]);

    if (isLoading || !user) {
        return <div className="flex justify-center items-center h-full"><Loader message="데이터를 불러오는 중..." /></div>;
    }

    return (
        <div>
            <PageHeader title="진행 상황" subtitle="데이터를 통해 당신의 성장을 확인해보세요." />

            <div className="bg-white p-6 rounded-xl shadow-md mb-8">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 sm:mb-0">운동 종목별 성장 기록</h3>
                    <select
                        value={selectedExercise}
                        onChange={(e) => setSelectedExercise(e.target.value)}
                        className="border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                        {uniqueExercises.map(ex => <option key={ex} value={ex}>{ex}</option>)}
                    </select>
                </div>
                {exerciseProgressData.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="h-80">
                             <h4 className="text-center font-medium text-gray-700 mb-2">운동 볼륨 (kg)</h4>
                             <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={exerciseProgressData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip formatter={(value: number) => `${value.toLocaleString()} kg`} />
                                    <Bar dataKey="volume" name="볼륨" fill="#3b82f6" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                         <div className="h-80">
                            <h4 className="text-center font-medium text-gray-700 mb-2">최대 무게 (kg)</h4>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={exerciseProgressData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis domain={['dataMin - 5', 'dataMax + 5']} />
                                    <Tooltip formatter={(value: number) => `${value.toLocaleString()} kg`} />
                                    <Area type="monotone" dataKey="maxWeight" name="최대 무게" stroke="#10b981" fill="#6ee7b7" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12 text-gray-500">
                        <p>선택한 운동에 대한 기록이 없습니다.</p>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ChartCard title="체중 및 근육량 변화 (kg)">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={user.weightHistory} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis yAxisId="left" domain={['dataMin - 2', 'dataMax + 2']} />
                            <YAxis yAxisId="right" orientation="right" domain={['dataMin - 2', 'dataMax + 2']} dataKey="mass" hide />
                            <Tooltip />
                            <Legend />
                            <Area yAxisId="left" type="monotone" dataKey="weight" name="체중" stroke="#4ade80" fill="#86efac" />
                             <Area yAxisId="right" type="monotone" dataKey="mass" name="근육량" stroke="#a855f7" fill="#c084fc" data={user.muscleMassHistory} />
                        </AreaChart>
                    </ResponsiveContainer>
                </ChartCard>
                 <ChartCard title="주간 운동 빈도">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={
                            useMemo(() => {
                                if (!workouts || workouts.length === 0) return [];
                                const workoutsByWeek = workouts.reduce((acc, workout) => {
                                    const d = new Date(workout.date);
                                    const day = d.getDay();
                                    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
                                    const weekStart = new Date(d.setDate(diff)).toISOString().split('T')[0];
                                    if (!acc[weekStart]) acc[weekStart] = 0;
                                    acc[weekStart]++;
                                    return acc;
                                }, {} as Record<string, number>);
                                return Object.entries(workoutsByWeek)
                                    .map(([week, count]) => ({ week: week.substring(5), count }))
                                    .sort((a, b) => new Date(a.week).getTime() - new Date(b.week).getTime())
                                    .slice(-12);
                            }, [workouts])
                        } margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="week" />
                            <YAxis allowDecimals={false} />
                            <Tooltip formatter={(value: number) => `${value} 회`} />
                            <Legend />
                            <Bar dataKey="count" name="운동 횟수" fill="#f97316" />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>
            </div>
        </div>
    );
};

export default Progress;
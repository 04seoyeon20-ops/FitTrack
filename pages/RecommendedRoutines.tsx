import React, { useState } from 'react';
import PageHeader from '../components/PageHeader';
import { RecommendedRoutine } from '../types';
import { getRecommendedRoutines } from '../services/geminiService';
import Loader from '../components/Loader';
import { PlayCircleIcon, PushupIcon, SquatIcon, PlankIcon, PullupIcon, LungeIcon, BicepCurlIcon, JumpingJackIcon, DumbbellIcon, RunningIcon } from '../components/Icons';

const getExerciseIcon = (key: string) => {
    switch (key) {
        case 'push_up': return <PushupIcon className="w-full h-full" />;
        case 'squat': return <SquatIcon className="w-full h-full" />;
        case 'plank': return <PlankIcon className="w-full h-full" />;
        case 'pull_up': return <PullupIcon className="w-full h-full" />;
        case 'lunge': return <LungeIcon className="w-full h-full" />;
        case 'bicep_curl': return <BicepCurlIcon className="w-full h-full" />;
        case 'jumping_jack': return <JumpingJackIcon className="w-full h-full" />;
        case 'running': case 'general_cardio': return <RunningIcon className="w-full h-full" />;
        case 'deadlift':
        case 'dumbbell_row':
        case 'overhead_press':
        case 'general_strength':
        default:
            return <DumbbellIcon className="w-full h-full" />;
    }
};


const RecommendedRoutines: React.FC = () => {
    const [fitnessLevel, setFitnessLevel] = useState('초급');
    const [goal, setGoal] = useState('체중 감량');
    const [daysPerWeek, setDaysPerWeek] = useState(3);
    const [routines, setRoutines] = useState<RecommendedRoutine[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setRoutines([]);
        setSubmitted(true);
        try {
            const result = await getRecommendedRoutines(fitnessLevel, goal, daysPerWeek);
            setRoutines(result);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <PageHeader title="AI 추천 루틴" subtitle="당신의 목표에 맞는 맞춤형 운동 계획을 받아보세요." />
            
            <div className="bg-white p-8 rounded-xl shadow-md mb-8">
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                    <div>
                        <label htmlFor="fitnessLevel" className="block text-sm font-medium text-gray-700">운동 수준</label>
                        <select id="fitnessLevel" value={fitnessLevel} onChange={e => setFitnessLevel(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
                            <option>초급</option>
                            <option>중급</option>
                            <option>고급</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="goal" className="block text-sm font-medium text-gray-700">주요 목표</label>
                        <select id="goal" value={goal} onChange={e => setGoal(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
                            <option>체중 감량</option>
                            <option>근육량 증가</option>
                            <option>전반적인 건강</option>
                            <option>지구력 향상</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="daysPerWeek" className="block text-sm font-medium text-gray-700">주당 운동 횟수</label>
                        <select id="daysPerWeek" value={daysPerWeek} onChange={e => setDaysPerWeek(Number(e.target.value))} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
                            <option>2</option>
                            <option>3</option>
                            <option>4</option>
                            <option>5</option>
                        </select>
                    </div>
                    <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300 transition-colors">
                        {loading ? '루틴 생성 중...' : '추천 받기'}
                    </button>
                </form>
            </div>

            {loading && <Loader message="AI가 당신만을 위한 운동 계획을 짜고 있습니다..." />}
            {error && <div className="text-red-500 bg-red-100 p-4 rounded-lg text-center">{error}</div>}
            
            {routines.length > 0 && (
                <div className="space-y-8">
                    {routines.map((routine, index) => (
                        <div key={index} className="bg-white p-6 rounded-xl shadow-md">
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">{routine.routineName}</h2>
                            <p className="text-gray-600 mb-6">{routine.description}</p>
                            <div className="space-y-4">
                                {routine.exercises.map((ex, exIndex) => (
                                    <div key={exIndex} className="p-4 border rounded-lg bg-gray-50 transition-shadow hover:shadow-md">
                                        <div className="flex items-start gap-4">
                                            <div className="flex-shrink-0 w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 p-2">
                                                {getExerciseIcon(ex.exerciseKey)}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-lg font-semibold text-blue-700">{ex.exerciseName}</h4>
                                                <p className="text-sm text-gray-500 mt-1">{ex.description}</p>
                                                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-gray-800">
                                                    <span><strong>세트:</strong> {ex.sets}</span>
                                                    <span><strong>반복:</strong> {ex.reps}</span>
                                                    <span><strong>휴식:</strong> {ex.rest}</span>
                                                </div>
                                            </div>
                                            <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(ex.youtubeSearchQuery)}`} target="_blank" rel="noopener noreferrer" className="flex-shrink-0 flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors self-center px-3 py-2 rounded-md hover:bg-blue-50">
                                                <PlayCircleIcon className="w-6 h-6"/>
                                                <span className="font-medium">자세 보기</span>
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
             {!loading && !error && submitted && routines.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500">AI가 추천 루틴을 생성하지 못했습니다. 다시 시도해 주세요.</p>
                </div>
             )}
        </div>
    );
};

export default RecommendedRoutines;
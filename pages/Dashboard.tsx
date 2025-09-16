import React from 'react';
import PageHeader from '../components/PageHeader';
import { FireIcon, WeightIcon, SparklesIcon, DumbbellIcon, MuscleIcon, RunningIcon } from '../components/Icons';
import { Link } from 'react-router-dom';
import { User, SimpleWorkout } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useAuth } from '../contexts/AuthContext';
import Loader from '../components/Loader';


const StatCard: React.FC<{ icon: React.ElementType; label: string; value: string; color: string }> = ({ icon: Icon, label, value, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-md flex items-center">
    <div className={`p-3 rounded-full mr-4 ${color} transition-transform duration-200 ease-in-out hover:scale-110`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

const getWorkoutIcon = (exercise: string) => {
    const lowerCaseExercise = exercise.toLowerCase();
    if (lowerCaseExercise.includes('달리기') || lowerCaseExercise.includes('러닝')) {
        return <RunningIcon className="w-8 h-8 text-white" />;
    }
    if (lowerCaseExercise.includes('스쿼트') || lowerCaseExercise.includes('벤치') || lowerCaseExercise.includes('데드')) {
        return <DumbbellIcon className="w-8 h-8 text-white" />;
    }
    return <DumbbellIcon className="w-8 h-8 text-white" />;
};

const ActivityPill: React.FC<{ workout: SimpleWorkout }> = ({ workout }) => (
    <div className="flex items-center gap-3 bg-white p-3 rounded-lg shadow-sm">
        <div className="p-3 rounded-full bg-indigo-500 transition-transform duration-200 ease-in-out hover:scale-110">
            {getWorkoutIcon(workout.exercise)}
        </div>
        <div>
            <p className="font-semibold text-gray-800">{workout.exercise}</p>
            <p className="text-sm text-gray-500">{workout.duration}분</p>
        </div>
    </div>
);

const ChartCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
        <div className="h-64">
            {children}
        </div>
    </div>
);

const QuickLink: React.FC<{ to: string; icon: React.ElementType; label: string; description: string }> = ({ to, icon: Icon, label, description }) => (
    <Link to={to} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow flex items-start space-x-4">
        <div className="p-3 rounded-full bg-blue-100">
            <Icon className="w-6 h-6 text-blue-600"/>
        </div>
        <div>
            <h3 className="text-lg font-semibold text-gray-800">{label}</h3>
            <p className="text-gray-500">{description}</p>
        </div>
    </Link>
)

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <div className="flex justify-center items-center h-full"><Loader /></div>;
  }

  return (
    <div>
      <PageHeader title={`${user.name}님, 안녕하세요!`} subtitle="오늘도 건강한 하루 보내세요. 진행 상황을 확인해보세요." />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard icon={FireIcon} label="연속 운동" value={`${user.workoutStreak || 0}일`} color="bg-orange-500" />
        <StatCard icon={DumbbellIcon} label="이번 주 운동" value="0회" color="bg-blue-500" />
        <StatCard icon={WeightIcon} label="현재 체중" value={`${user.weight} kg`} color="bg-green-500" />
        <StatCard icon={MuscleIcon} label="현재 근육량" value={`${user.muscleMass || 0} kg`} color="bg-purple-500" />
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">최근 활동</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                  <h3 className="font-semibold text-gray-600 mb-3">오늘의 운동</h3>
                  <div className="space-y-3">
                    {user.recentWorkouts && user.recentWorkouts.today.length > 0 ? (
                        user.recentWorkouts.today.map((w, i) => <ActivityPill key={`today-${i}`} workout={w}/>)
                    ) : (
                        <p className="text-gray-500">오늘 운동 기록이 없습니다.</p>
                    )}
                  </div>
              </div>
               <div>
                  <h3 className="font-semibold text-gray-600 mb-3">어제의 운동</h3>
                  <div className="space-y-3">
                    {user.recentWorkouts && user.recentWorkouts.yesterday.length > 0 ? (
                        user.recentWorkouts.yesterday.map((w, i) => <ActivityPill key={`yesterday-${i}`} workout={w}/>)
                     ) : (
                        <p className="text-gray-500">어제 운동 기록이 없습니다.</p>
                    )}
                  </div>
              </div>
          </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <ChartCard title="체중 변화 (kg)">
              <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={user.weightHistory} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={['dataMin - 2', 'dataMax + 2']} />
                      <Tooltip />
                      <Legend />
                      <Area type="monotone" dataKey="weight" name="체중" stroke="#4ade80" fill="#86efac" />
                  </AreaChart>
              </ResponsiveContainer>
          </ChartCard>
          <ChartCard title="근육량 변화 (kg)">
              <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={user.muscleMassHistory} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={['dataMin - 2', 'dataMax + 2']} />
                      <Tooltip />
                      <Legend />
                      <Area type="monotone" dataKey="mass" name="근육량" stroke="#a855f7" fill="#c084fc" />
                  </AreaChart>
              </ResponsiveContainer>
          </ChartCard>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">빠른 시작</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <QuickLink 
                to="/workout-log"
                icon={DumbbellIcon}
                label="운동 기록하기"
                description="오늘의 운동을 추가하고 진행 상황을 추적하세요."
            />
             <QuickLink 
                to="/recommendations"
                icon={SparklesIcon}
                label="AI 루틴 추천받기"
                description="당신의 목표에 맞는 맞춤형 운동 계획을 생성하세요."
            />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
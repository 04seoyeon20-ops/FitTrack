import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import WorkoutLog from './pages/WorkoutLog';
import RecommendedRoutines from './pages/RecommendedRoutines';
import DietInfo from './pages/DietInfo';
import Misconceptions from './pages/Misconceptions';
import MyProfile from './pages/MyProfile';
import AICoach from './pages/AICoach';
import Progress from './pages/Progress';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import { useAuth } from './contexts/AuthContext';
import Loader from './components/Loader';

// This component contains the main app structure after login
const MainApp: React.FC = () => (
  <Layout>
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/workout-log" element={<WorkoutLog />} />
      <Route path="/progress" element={<Progress />} />
      <Route path="/recommendations" element={<RecommendedRoutines />} />
      <Route path="/ai-coach" element={<AICoach />} />
      <Route path="/diet-info" element={<DietInfo />} />
      <Route path="/misconceptions" element={<Misconceptions />} />
      <Route path="/profile" element={<MyProfile />} />
      {/* Redirect any other nested paths to the dashboard */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </Layout>
);

const App: React.FC = () => {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-gray-50">
        <Loader message="앱을 불러오는 중..." />
      </div>
    );
  }

  return (
    <Routes>
      {isAuthenticated ? (
        <>
          <Route path="/*" element={<MainApp />} />
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="/signup" element={<Navigate to="/" replace />} />
        </>
      ) : (
        <>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </>
      )}
    </Routes>
  );
};

export default App;
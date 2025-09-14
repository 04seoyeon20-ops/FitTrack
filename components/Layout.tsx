import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { DashboardIcon, DumbbellIcon, SparklesIcon, BookOpenIcon, QuestionMarkCircleIcon, UserCircleIcon, FireIcon, ChatBubbleIcon, ChartPieIcon, LogoutIcon } from './Icons';
import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { path: '/', label: '대시보드', icon: DashboardIcon },
  { path: '/workout-log', label: '운동 기록', icon: DumbbellIcon },
  { path: '/progress', label: '진행 상황', icon: ChartPieIcon },
  { path: '/recommendations', label: 'AI 추천 루틴', icon: SparklesIcon },
  { path: '/ai-coach', label: 'AI 운동 상담', icon: ChatBubbleIcon },
  { path: '/diet-info', label: 'AI 식단 관리', icon: BookOpenIcon },
  { path: '/misconceptions', label: '오늘의 퀴즈', icon: QuestionMarkCircleIcon },
  { path: '/profile', label: '내 프로필', icon: UserCircleIcon },
];

const Sidebar: React.FC = () => {
  const baseLinkClasses = "flex items-center px-4 py-3 text-gray-600 transition-colors duration-200 transform rounded-lg";
  const activeLinkClasses = "bg-blue-100 text-blue-700";
  const inactiveLinkClasses = "hover:bg-gray-200";

  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <aside className="fixed top-0 left-0 flex flex-col w-64 h-screen px-4 py-8 bg-white border-r rtl:border-r-0 rtl:border-l">
      <a href="#" className="flex items-center space-x-2 text-2xl font-bold text-blue-600">
        <FireIcon className="w-8 h-8"/>
        <span>FitTrack AI</span>
      </a>

      <div className="flex flex-col justify-between flex-1 mt-6">
        <nav>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) => 
                `${baseLinkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="mx-4 font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>
         <div>
          <button
            onClick={handleLogout}
            className={`${baseLinkClasses} ${inactiveLinkClasses} w-full`}
          >
            <LogoutIcon className="w-5 h-5" />
            <span className="mx-4 font-medium">로그아웃</span>
          </button>
        </div>
      </div>
    </aside>
  );
};


const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <Sidebar />
      <main className="flex-1 p-8 ml-64">
        {children}
      </main>
    </div>
  );
};

export default Layout;
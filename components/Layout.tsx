import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
    DashboardIcon, DumbbellIcon, SparklesIcon, BookOpenIcon, 
    QuestionMarkCircleIcon, UserCircleIcon, FireIcon, ChatBubbleIcon, 
    ChartPieIcon, LogoutIcon, MenuIcon 
} from './Icons';
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

const SidebarContent: React.FC = () => {
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
    <aside className="flex flex-col w-full h-full px-4 py-8 bg-white border-r">
      <a href="#/" className="flex items-center space-x-2 text-2xl font-bold text-blue-600 px-4">
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // 페이지 이동 시 모바일 사이드바 닫기
    setIsSidebarOpen(false);
  }, [location.pathname]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 z-30 bg-black bg-opacity-50 transition-opacity md:hidden ${
          isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={toggleSidebar}
      />
      
      {/* Sidebar */}
      <div className={`fixed top-0 left-0 z-40 h-full w-64 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <SidebarContent />
      </div>

      <div className="flex-1 flex flex-col md:ml-64">
        {/* Mobile Top Bar */}
        <header className="sticky top-0 z-20 flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm border-b md:hidden">
          <button onClick={toggleSidebar} className="text-gray-600 p-2 -ml-2">
            <MenuIcon className="w-6 h-6" />
          </button>
          <a href="#/" className="flex items-center space-x-2 text-xl font-bold text-blue-600">
            <FireIcon className="w-7 h-7"/>
            <span>FitTrack AI</span>
          </a>
          <div className="w-6"></div> {/* Spacer */}
        </header>

        <main className="flex-1 p-4 sm:p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
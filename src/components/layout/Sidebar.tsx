import React from 'react';
import { MdDashboard, MdScience, MdSettings } from 'react-icons/md';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const menuItems: MenuItem[] = [
  { id: 'dashboard', label: '대시보드', icon: <MdDashboard size={24} /> },
  { id: 'test', label: '테스트', icon: <MdScience size={24} /> },
  { id: 'settings', label: '설정', icon: <MdSettings size={24} /> },
];

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate }) => {
  return (
    <div className="w-72 bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 text-white h-screen flex flex-col shadow-2xl">
      {/* Logo */}
      <div className="p-8 border-b border-white/10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
            <MdDashboard size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent">
              Action Guide
            </h1>
            <p className="text-xs text-blue-200/70">Collector v1.0</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-6 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl font-medium transition-all duration-200 ${
              currentPage === item.id
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-purple-500/50 scale-105'
                : 'text-blue-100/80 hover:bg-white/10 hover:text-white hover:translate-x-1'
            }`}
          >
            <div className={`${currentPage === item.id ? 'scale-110' : ''} transition-transform`}>
              {item.icon}
            </div>
            <span className="text-base">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-6 border-t border-white/10">
        <div className="flex items-center gap-3 text-blue-200/50 text-sm">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span>시스템 정상</span>
        </div>
      </div>
    </div>
  );
};

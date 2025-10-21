import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface LayoutProps {
  children: (currentPage: string) => React.ReactNode;
}

const pageTitles: Record<string, string> = {
  dashboard: '대시보드',
  test: '테스트',
  settings: '설정',
};

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState('dashboard');

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={pageTitles[currentPage]} />
        <main className="flex-1 overflow-auto p-6">
          {children(currentPage)}
        </main>
      </div>
    </div>
  );
};

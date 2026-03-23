import React from 'react';
import SideNav from './SideNav';
import TopBar from './TopBar';

interface AppLayoutProps {
  children: React.ReactNode;
  topBarTitle?: string;
}

export default function AppLayout({ children, topBarTitle }: AppLayoutProps) {
  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <SideNav />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <TopBar title={topBarTitle} />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

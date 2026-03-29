import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SideNav from './SideNav';
import TopBar from './TopBar';
import { ResizeDivider, MobileBottomNav } from '@/components/common';
import type { MobileNavItem } from '@/components/common';
import { ChatPopout } from '@/components/features/chat';
import { usePanelResize } from '@/hooks/usePanelResize';

const APP_NAV_ITEMS: MobileNavItem[] = [
  { label: '작업', icon: 'checklist', value: '/tasks' },
  { label: '일정', icon: 'route', value: '/itinerary' },
  { label: 'Plan', icon: 'edit_note', value: '/plan' },
  { label: 'Chat', icon: 'smart_toy', value: 'chat' },
];

interface AppLayoutProps {
  children: React.ReactNode;
  topBarTitle?: string;
}

export default function AppLayout({ children, topBarTitle }: AppLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [chatOpen, setChatOpen] = useState(false);

  const { size: sidebarWidth, isDragging, handleMouseDown, handleTouchStart } = usePanelResize({
    direction: 'horizontal',
    initialSize: 288,
    minSize: 200,
    maxSize: 400,
    storageKey: 'sidebar-width',
  });

  const handleMobileNavSelect = (value: string) => {
    if (value === 'chat') { setChatOpen(true); return; }
    navigate(value);
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <div className="hidden md:flex flex-shrink-0 z-40 sticky top-0 h-screen">
        <SideNav width={sidebarWidth} onOpenChat={() => setChatOpen(true)} />
      </div>
      <div className={`relative flex-1 flex flex-col min-w-0 h-screen ${isDragging ? 'pointer-events-none select-none' : ''}`}>

        <div className="absolute top-0 left-0 z-50 hidden md:block h-20 w-0">
          <ResizeDivider
            direction="horizontal"
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            isDragging={isDragging}
            className="absolute top-0 -left-[4px] h-fit"
          />
        </div>

        <TopBar title={topBarTitle} />

        <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
          {children}
        </main>
      </div>
      {/* Global mobile bottom nav */}
      <MobileBottomNav
        items={APP_NAV_ITEMS}
        activeValue={location.pathname}
        onSelect={handleMobileNavSelect}
      />

      {/* Chat popout overlay */}
      <ChatPopout isOpen={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  );
}

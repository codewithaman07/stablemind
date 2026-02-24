'use client';

import { useState, useEffect, createContext, useContext } from "react";
import Sidebar from "./Sidebar";
import ThemeToggle from "./ThemeToggle";
import Logo from "./Logo";
import { FaBars } from "react-icons/fa";
import { useChatContext } from "../context/ChatContext";
import { UserButton } from "@clerk/nextjs";

// Context so child components (like the dashboard page) can toggle the left panel
interface LayoutContextType {
  leftSidebarOpen: boolean;
  setLeftSidebarOpen: (open: boolean) => void;
  toggleLeftSidebar: () => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export function useLayoutContext() {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayoutContext must be used within a DashboardLayout');
  }
  return context;
}

export default function DashboardLayout({
  children,
  isGuestMode = false
}: {
  children: React.ReactNode;
  isGuestMode?: boolean;
}) {
  // Left sidebar: open by default on desktop, closed on mobile
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const { clearChatHistory } = useChatContext();

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setLeftSidebarOpen(false);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleLeftSidebar = () => setLeftSidebarOpen(!leftSidebarOpen);

  return (
    <LayoutContext.Provider value={{ leftSidebarOpen, setLeftSidebarOpen, toggleLeftSidebar }}>
      <div className="flex min-h-screen" style={{ background: 'var(--bg-primary)' }}>

        {/* Mobile overlay */}
        {isMobile && leftSidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/50 transition-opacity"
            onClick={() => setLeftSidebarOpen(false)}
          />
        )}

        {/* Left Sidebar */}
        <div
          className="flex-shrink-0 transition-all duration-300 ease-in-out border-r z-40 bg-[var(--bg-secondary)] border-[var(--border-primary)]"
          style={{
            width: leftSidebarOpen ? '260px' : (isMobile ? '0px' : '68px'),
            position: isMobile ? 'fixed' : 'relative',
            top: 0,
            left: 0,
            height: isMobile ? '100vh' : 'auto',
            overflow: 'hidden'
          }}
        >
          <div className="w-full h-full">
            <Sidebar
              isOpen={leftSidebarOpen}
              onClose={toggleLeftSidebar}
              onToggle={toggleLeftSidebar}
              clearChat={clearChatHistory}
            />
          </div>
        </div>

        {/* Main area */}
        <div className="flex-1 flex flex-col min-w-0 relative">
          {/* Top bar with toggles */}
          <div className="sticky top-0 z-20 px-3 py-2.5 flex items-center gap-3 border-b" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-primary)' }}>
            {/* Mobile toggle */}
            {!leftSidebarOpen && isMobile && (
              <button
                onClick={toggleLeftSidebar}
                className="p-2 rounded-lg transition-all"
                style={{ color: 'var(--text-secondary)' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-tertiary)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                aria-label="Open sidebar"
                title="Open sidebar"
              >
                <FaBars size={16} />
              </button>
            )}

            {/* App name (visible when sidebar is closed) */}
            {!leftSidebarOpen && (
              <div className="flex items-center gap-2 animate-fade-in">
                <div className="w-6 h-6 rounded-md flex items-center justify-center text-white" style={{ background: 'var(--accent-primary)' }}>
                  <Logo size={14} />
                </div>
                <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>StableMind</span>
              </div>
            )}

            <div className="flex-1" />

            {/* Theme toggle */}
            <ThemeToggle size={16} />

            {/* Account Image */}
            <div className="flex items-center">
              {!isGuestMode && (
                <UserButton
                  appearance={{
                    elements: {
                      userButtonBox: "w-8 h-8 rounded-lg overflow-hidden",
                      userButtonTrigger: "w-8 h-8 rounded-lg overflow-hidden ring-2 ring-[var(--border-primary)] hover:ring-[var(--accent-primary)] hover:scale-105 transition-all outline-none",
                      avatarBox: "rounded-lg",
                      userButtonAvatarBox: "rounded-lg"
                    }
                  }}
                />
              )}
            </div>
          </div>

          {/* Main content */}
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </LayoutContext.Provider>
  );
}

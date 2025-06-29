'use client';

import { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import Chat from "../components/Chat";
import ToolsPanel from "../components/tools/ToolsPanel";
import { FaTools } from "react-icons/fa";
import { ChatProvider } from "../context/ChatContext";

export default function DashboardPage() {
  const [mobileToolsVisible, setMobileToolsVisible] = useState(false);
  return (
    <ChatProvider>
      <DashboardLayout>
        <div className="min-h-screen flex flex-col">
          {/* Main content area with right sidebar for tools */}
          <div className="flex-1 flex relative">
            {/* Chat takes up full width on mobile, most space on desktop */}
            <div className={`flex-1 max-w-4xl mx-auto px-4 ${mobileToolsVisible ? 'hidden md:block' : 'w-full'}`}>
              <Chat />
            </div>
          
          {/* Desktop: Right sidebar for tools (only visible on larger screens) */}
          <div className="w-64 hidden lg:block">
            <div className="sticky top-4 h-[calc(100vh-2rem)]">
              <ToolsPanel />
            </div>
          </div>
          
          {/* Mobile: Full-screen tools panel */}
          <div className={`fixed inset-0 z-30 bg-gray-900 ${mobileToolsVisible ? 'block' : 'hidden'} md:hidden`}>
            <div className="p-4">
              <button 
                onClick={() => setMobileToolsVisible(false)}
                className="mb-4 px-4 py-2 bg-gray-800 rounded-lg text-white flex items-center gap-2"
              >
                Back to Chat
              </button>
              <ToolsPanel />
            </div>
          </div>
        </div>
        
        {/* Mobile tools button (fixed at bottom) */}
        <button 
          onClick={() => setMobileToolsVisible(true)}
          className="fixed bottom-6 right-6 md:hidden z-20 w-14 h-14 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-lg"
          aria-label="Open wellness tools"
        >
          <FaTools size={24} />
        </button>      </div>
    </DashboardLayout>
  </ChatProvider>
  );
}

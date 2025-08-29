"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import DashboardLayout from "../components/DashboardLayout";
import Chat from "../components/Chat";
import ToolsPanel from "../components/tools/ToolsPanel";
import { FaTools } from "react-icons/fa";
import { ChatProvider } from "../context/ChatContext";

export default function DashboardPage() {
  const { isSignedIn, isLoaded } = useUser();
  const [mobileToolsVisible, setMobileToolsVisible] = useState(false);

  // Listen for wellness tool requests and show mobile tools panel if needed
  useEffect(() => {
    const handleOpenWellnessTool = () => {
      // On mobile/tablet, show the tools panel when a wellness tool is requested
      if (window.innerWidth < 1024) { // lg breakpoint
        setMobileToolsVisible(true);
      }
    };

    window.addEventListener('openWellnessTool', handleOpenWellnessTool as EventListener);
    
    return () => {
      window.removeEventListener('openWellnessTool', handleOpenWellnessTool as EventListener);
    };
  }, []);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 bg-purple-900 rounded-full flex items-center justify-center text-3xl font-bold text-purple-300 mx-auto mb-4">
            SM
          </div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="text-gray-600 dark:text-gray-300 mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <ChatProvider>
      <DashboardLayout isGuestMode={!isSignedIn}>
        <div className="min-h-screen flex flex-col">
          <div className="flex-1 flex relative">
            <div
              className={`flex-1 max-w-4xl mx-auto px-4 ${
                mobileToolsVisible ? "hidden md:block" : "w-full"
              }`}
            >
              <Chat />
            </div>
            <div className="w-64 hidden lg:block">
              <div className="sticky top-4 h-[calc(100vh-2rem)]">
                <ToolsPanel />
              </div>
            </div>
            <div
              className={`fixed inset-0 z-30 bg-gray-900 ${
                mobileToolsVisible ? "block" : "hidden"
              } md:hidden`}
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-4 bg-gray-800">
                  <h2 className="text-white font-semibold">Wellness Tools</h2>
                  <button
                    onClick={() => setMobileToolsVisible(false)}
                    className="text-white hover:text-gray-300 text-xl font-bold"
                  >
                    ×
                  </button>
                </div>
                <div className="flex-1 p-4 overflow-hidden">
                  <ToolsPanel />
                </div>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => setMobileToolsVisible(!mobileToolsVisible)}
            className="fixed bottom-4 right-4 lg:hidden bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-full shadow-lg z-40"
          >
            <FaTools size={20} />
          </button>
        </div>
      </DashboardLayout>
    </ChatProvider>
  );
}
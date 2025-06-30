"use client";

import { useState } from "react";
import {
  useUser,
  RedirectToSignIn,
  SignInButton,
  SignUpButton,
} from "@clerk/nextjs";
import DashboardLayout from "../components/DashboardLayout";
import Chat from "../components/Chat";
import ToolsPanel from "../components/tools/ToolsPanel";
import { FaTools } from "react-icons/fa";
import { ChatProvider } from "../context/ChatContext";

export default function DashboardPage() {
  const { isSignedIn, isLoaded, user } = useUser();
  const [mobileToolsVisible, setMobileToolsVisible] = useState(false);

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
          <button
            onClick={() => setMobileToolsVisible(true)}
            className="fixed bottom-6 right-6 md:hidden z-20 w-14 h-14 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-lg"
            aria-label="Open wellness tools"
          >
            <FaTools size={24} />
          </button>
        </div>
      </DashboardLayout>
    </ChatProvider>
  );
}

"use client";

import { useUser } from "@clerk/nextjs";
import DashboardLayout from "../components/DashboardLayout";
import Chat from "../components/Chat";
import { ChatProvider } from "../context/ChatContext";
import Logo from "../components/Logo";

function DashboardContent() {
  return (
    <div className="h-[calc(100vh-45px)] flex relative">
      <div className="flex-1 min-w-0">
        <Chat />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
        <div className="text-center">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white mx-auto mb-4" style={{ background: 'var(--accent-primary)' }}>
            <Logo size={24} />
          </div>
          <div className="w-6 h-6 rounded-full mx-auto mb-3 animate-spin" style={{ border: '2px solid var(--border-primary)', borderTopColor: 'var(--accent-primary)' }} />
          <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <ChatProvider>
      <DashboardLayout isGuestMode={!isSignedIn}>
        <DashboardContent />
      </DashboardLayout>
    </ChatProvider>
  );
}
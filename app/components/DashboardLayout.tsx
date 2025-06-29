'use client';

import { useState } from "react";
import Sidebar from "./Sidebar";
import { FaBars, FaTimes } from "react-icons/fa";
import { useChatContext } from "../context/ChatContext";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { clearChatHistory } = useChatContext();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white dark:bg-gray-900">
      
      <div className="md:hidden fixed top-0 left-0 right-0 z-20 p-4 bg-gray-900 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-purple-900 rounded-full flex items-center justify-center text-sm font-bold text-purple-300">SM</div>
          <span className="text-lg font-bold text-white">StableMind</span>
        </div>
        <button 
          onClick={toggleSidebar} 
          className="p-2 text-white rounded-lg hover:bg-gray-800"
          aria-label={sidebarOpen ? "Close menu" : "Open menu"}
        >
          {sidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>
        
      <div className={`${sidebarOpen ? 'fixed inset-0 z-10 bg-black bg-opacity-50' : 'hidden'} md:block md:static`}>
        <Sidebar isOpen={sidebarOpen} onClose={toggleSidebar} clearChat={clearChatHistory} />
      </div>
      
      
      <main className="flex-1 overflow-y-auto mt-16 md:mt-0">
        {children}
      </main>
    </div>
  );
}

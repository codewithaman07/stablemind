'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface ChatContextType {
  clearChatHistory: () => void;
  messages: { role: string; content: string }[];
  setMessages: React.Dispatch<React.SetStateAction<{ role: string; content: string }[]>>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<{role: string; content: string}[]>(() => {
    // Try to load messages from localStorage on component mount (client-side only)
    if (typeof window !== 'undefined') {
      const savedMessages = localStorage.getItem('stablemind_chat_history');
      if (savedMessages) {
        try {
          return JSON.parse(savedMessages);
        } catch (error) {
          console.error("Failed to parse saved chat history:", error);
        }
      }
    }
    // Default initial message if nothing in localStorage
    return [ 
      { 
        role: "bot", 
        content: "Hi there! I'm StableMind, your placement companion. How can I help you today with your placement preparation or career concerns?" 
      }
    ];
  });

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined' && messages.length > 0) {
      localStorage.setItem('stablemind_chat_history', JSON.stringify(messages));
    }
  }, [messages]);

  // Function to clear chat history
  const clearChatHistory = () => {
    // Reset to initial message
    const initialMessage = [{ 
      role: "bot", 
      content: "Hi there! I'm StableMind, your placement companion. How can I help you today with your placement preparation or career concerns?" 
    }];
    
    setMessages(initialMessage);
    
    // Also clear from localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('stablemind_chat_history', JSON.stringify(initialMessage));
    }
  };

  return (
    <ChatContext.Provider value={{ clearChatHistory, messages, setMessages }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
}

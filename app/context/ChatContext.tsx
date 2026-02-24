'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { DetectedEmotion } from '../services/emotionDetection';

interface Message {
  role: string;
  content: string;
  emotionSuggestions?: DetectedEmotion[];
}

interface ChatContextType {
  clearChatHistory: () => void;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const INITIAL_MESSAGES: Message[] = [{
  role: "bot",
  content: "Hi there! I'm StableMind, your placement companion. How can I help you today with your placement preparation or career concerns?"
}];

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);

  const clearChatHistory = () => {
    setMessages(INITIAL_MESSAGES);
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

'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import { DetectedEmotion } from '../services/emotionDetection';
import { useUser } from '@clerk/nextjs';
import {
  createChatSession,
  getChatSessions,
  getChatMessages,
  saveChatMessage,
  deleteChatSession,
  updateChatSessionTitle,
  ChatSessionDB,
} from '../lib/database';

interface Message {
  role: string;
  content: string;
  emotionSuggestions?: DetectedEmotion[];
}

interface ChatContextType {
  clearChatHistory: () => void;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  currentSessionId: string | null;
  chatSessions: ChatSessionDB[];
  loadSession: (sessionId: string) => Promise<void>;
  startNewSession: () => void;
  deleteSession: (sessionId: string) => Promise<void>;
  persistMessage: (role: string, content: string) => Promise<void>;
  isLoadingSessions: boolean;
  isLoadingMessages: boolean;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const INITIAL_MESSAGES: Message[] = [{
  role: "bot",
  content: "Hi there! I'm StableMind, your placement companion. How can I help you today with your placement preparation or career concerns?"
}];

export function ChatProvider({ children }: { children: ReactNode }) {
  const { user } = useUser();
  const userId = user?.id || null;
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [chatSessions, setChatSessions] = useState<ChatSessionDB[]>([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const hasLoadedRef = useRef(false);

  // Load chat sessions + auto-resume most recent session on mount
  useEffect(() => {
    if (!userId || hasLoadedRef.current) return;
    hasLoadedRef.current = true;

    async function loadAndResume() {
      setIsLoadingSessions(true);
      try {
        const sessions = await getChatSessions(userId!);
        setChatSessions(sessions);

        // Auto-load the most recent session (first one, since sorted by updated_at DESC)
        if (sessions.length > 0) {
          const latestSession = sessions[0];
          setIsLoadingMessages(true);
          try {
            const msgs = await getChatMessages(latestSession.id!);
            if (msgs.length > 0) {
              setMessages(msgs.map(m => ({ role: m.role, content: m.content })));
              setCurrentSessionId(latestSession.id!);
            }
          } catch (err) {
            console.error('Failed to load latest session messages:', err);
          } finally {
            setIsLoadingMessages(false);
          }
        }
      } catch (err) {
        console.error('Failed to load chat sessions:', err);
      } finally {
        setIsLoadingSessions(false);
      }
    }

    loadAndResume();
  }, [userId]);

  const startNewSession = useCallback(() => {
    setMessages(INITIAL_MESSAGES);
    setCurrentSessionId(null);
  }, []);

  const loadSession = useCallback(async (sessionId: string) => {
    if (!userId) return;

    setIsLoadingMessages(true);
    try {
      const msgs = await getChatMessages(sessionId);
      if (msgs.length > 0) {
        setMessages(msgs.map(m => ({ role: m.role, content: m.content })));
        setCurrentSessionId(sessionId);
      }
    } catch (err) {
      console.error('Failed to load session:', err);
    } finally {
      setIsLoadingMessages(false);
    }
  }, [userId]);

  const deleteSession = useCallback(async (sessionId: string) => {
    if (!userId) return;

    try {
      await deleteChatSession(sessionId);
      setChatSessions(prev => prev.filter(s => s.id !== sessionId));

      // If we deleted the current session, start fresh
      if (currentSessionId === sessionId) {
        setMessages(INITIAL_MESSAGES);
        setCurrentSessionId(null);
      }
    } catch (err) {
      console.error('Failed to delete session:', err);
    }
  }, [userId, currentSessionId]);

  const persistMessage = useCallback(async (role: string, content: string) => {
    if (!userId) return;

    let sessionId = currentSessionId;

    // Auto-create a session if none exists
    if (!sessionId) {
      try {
        const session = await createChatSession(userId);
        sessionId = session.id;
        setCurrentSessionId(sessionId);

        // Save the bot greeting first
        await saveChatMessage({
          session_id: sessionId!,
          role: 'bot',
          content: INITIAL_MESSAGES[0].content,
        });

        // Refresh sessions
        const sessions = await getChatSessions(userId);
        setChatSessions(sessions);
      } catch (err) {
        console.error('Failed to auto-create session:', err);
        return;
      }
    }

    try {
      await saveChatMessage({ session_id: sessionId!, role, content });

      // Auto-title the session after the first user message
      if (role === 'user') {
        const title = content.length > 40 ? content.substring(0, 40) + '…' : content;
        try {
          await updateChatSessionTitle(sessionId!, title);
          setChatSessions(prev =>
            prev.map(s => s.id === sessionId ? { ...s, title } : s)
          );
        } catch {
          // Non-critical, ignore
        }
      }
    } catch (err) {
      console.error('Failed to persist message:', err);
    }
  }, [userId, currentSessionId]);

  const clearChatHistory = useCallback(() => {
    setMessages(INITIAL_MESSAGES);
    setCurrentSessionId(null);
  }, []);

  return (
    <ChatContext.Provider value={{
      clearChatHistory,
      messages,
      setMessages,
      currentSessionId,
      chatSessions,
      loadSession,
      startNewSession,
      deleteSession,
      persistMessage,
      isLoadingSessions,
      isLoadingMessages,
    }}>
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

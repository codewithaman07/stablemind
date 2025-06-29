'use client';

import { useState, useRef, useEffect } from "react";
import { chatWithGemini } from "../services/geminiService";
import { retrieveRelevantContent } from "../services/ragService";
import { FaArrowRight, FaFileUpload } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { detectCrisis, mentalHealthHelplines } from "../services/crisisDetection";
import { useChatContext } from "../context/ChatContext";

export default function Chat() {
  const router = useRouter();
  const { messages, setMessages, clearChatHistory } = useChatContext();
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  async function handleSendMessage() {
    if (!inputMessage.trim()) return;
    
    // Add user message to chat
    const userMessage = { role: "user", content: inputMessage };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);
    
    // Check for crisis keywords immediately
    const isCrisisMessage = detectCrisis(inputMessage);
        // If it's a crisis message, show immediate support alert
    if (isCrisisMessage) {
      // Add an immediate crisis response before the AI response
      setMessages(prev => [...prev, { 
        role: "alert", 
        content: `
          <div class="crisis-alert">
            <p><b>⚠️ Your wellbeing matters</b></p>
            <p>We've detected content that suggests you might be in distress. Professional help is available right now.</p>
            ${mentalHealthHelplines}
            <p>These helplines are staffed by trained professionals who understand what you're going through and can provide immediate support.</p>
            <p>We're still processing your message and will respond shortly.</p>
          </div>
        `
      }]);
    }
      try {
      // 1. Retrieve relevant context using RAG
      const context = await retrieveRelevantContent(inputMessage);
      
      // 2. Get response from Gemini with context and chat history
      // Filter messages to exclude 'alert' role messages
      const previousMessages = messages.filter(msg => msg.role === 'user' || msg.role === 'bot');
      
      // 3. Call Gemini with the full chat history
      const botResponse = await chatWithGemini(inputMessage, context, previousMessages);
      
      // 4. Add bot's response to chat
      setMessages(prev => [...prev, { role: "bot", content: botResponse }]);
    } catch (error) {
      console.error("Error in chat process:", error);
      
      // If it's a crisis message and there was an error, ensure helplines are shown
      if (isCrisisMessage) {
        setMessages(prev => [...prev, { 
          role: "bot", 
          content: `I'm having trouble connecting right now, but please reach out for support: ${mentalHealthHelplines}` 
        }]);
      } else {
        setMessages(prev => [...prev, { 
          role: "bot", 
          content: "I'm having trouble connecting right now. Please try again in a moment." 
        }]);
      }    } finally {
      setIsLoading(false);
    }
  }
  
  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] md:h-[calc(100vh-2rem)] bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden">      {/* Stable Mind Header */}
      <div className="p-3 md:p-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-indigo-500 rounded-full flex items-center justify-center text-white text-xl">
              🔔
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-white">Stable Mind</h2>
              <p className="text-xs md:text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full inline-block"></span>
                Ready to help you find calm
              </p>
            </div>          </div>
            <div className="flex items-center gap-2">
            <button 
              onClick={clearChatHistory}
              className="flex items-center gap-1 text-xs md:text-sm text-white bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 rounded-full px-3 py-1 transition-colors"
            >
              <span className="mr-1">✨</span>
              New Chat
            </button>
            
            <button 
              onClick={() => router.push('/documents')}
              className="flex items-center gap-1 text-xs md:text-sm text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 bg-gray-100 dark:bg-gray-800 rounded-full px-3 py-1 transition-colors"
            >
              <FaFileUpload size={14} className="mr-1" />
              My Documents
            </button>
          </div>
        </div>
      </div>
      {/* Chat Messages */}
      <div className="flex-1 p-3 md:p-4 overflow-y-auto bg-white dark:bg-gray-900">
        <div className="max-w-2xl mx-auto">{messages.map((message, index) => (            <div
              key={index}
              className={`mb-6 ${
                message.role === "user" ? "flex justify-end" : "flex justify-start"
              }`}
            >
              {(message.role === "bot" || message.role === "alert") && (
                <div className="mr-3 flex-shrink-0">
                  <div className={`w-9 h-9 ${message.role === "alert" ? "bg-red-500" : "bg-indigo-500"} rounded-full flex items-center justify-center text-white text-xl`}>
                    {message.role === "alert" ? "⚠️" : "🔔"}
                  </div>
                </div>
              )}
              
              {/* Message */}              <div                className={`px-3 md:px-4 py-2 md:py-3 rounded-2xl max-w-[85%] ${
                  message.role === "user"
                    ? "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                    : message.role === "alert"
                    ? "bg-red-500 text-white"
                    : "bg-indigo-500 text-white"
                } chat-message`}
              >
                {message.role === "bot" || message.role === "alert" ? (
                  <div dangerouslySetInnerHTML={{ __html: message.content }} className="prose dark:prose-invert max-w-none" />
                ) : (
                  message.content
                )}
              </div>
              
              {message.role === "user" && (
                <div className="ml-3 flex-shrink-0">
                  <div className="w-9 h-9 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-300">
                    U
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>        {isLoading && (
          <div className="text-left mb-4">
            <div className="inline-block p-3 rounded-lg bg-purple-500 text-white">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: "0.2s"}}></div>
                <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: "0.4s"}}></div>
              </div>
            </div>
          </div>
        )}
        {/* Wellness tools suggestions removed - now only accessible from the Tools panel */}
        
        <div ref={messagesEndRef} />
      </div>        {/* Input Area */}      <div className="p-3 md:p-4 bg-white dark:bg-gray-900">
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              className="w-full p-3 md:p-4 pl-4 md:pl-5 pr-12 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 text-gray-800 dark:text-white text-sm md:text-base"
              placeholder="Share what's on your mind..."
            />            <button
              onClick={handleSendMessage}
              disabled={isLoading}
              aria-label="Send message"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 bg-indigo-500 hover:bg-indigo-600 text-white rounded-full flex items-center justify-center disabled:opacity-50 transition-colors"
            >
              <FaArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

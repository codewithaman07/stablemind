'use client';

import { useState, useRef, useEffect } from "react";
import { chatWithGemini } from "../services/geminiService";
import { retrieveRelevantContent } from "../services/ragService";
import { FaArrowRight } from "react-icons/fa";
import { detectCrisis, mentalHealthHelplines } from "../services/crisisDetection";
import { getEmotionBasedSuggestions, DetectedEmotion } from "../services/emotionDetection";
import { useChatContext } from "../context/ChatContext";

export default function Chat() {
  const { messages, setMessages, clearChatHistory } = useChatContext();
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle opening wellness tools
  const handleOpenWellnessTool = (toolId: string | null) => {
    if (!toolId) return;
    // Create a custom event to communicate with the parent component
    const event = new CustomEvent('openWellnessTool', { detail: { toolId } });
    window.dispatchEvent(event);
  };
  async function handleSendMessage() {
    if (!inputMessage.trim()) return;
    
    // Detect emotions in the user's message
    const detectedEmotions = getEmotionBasedSuggestions(inputMessage);
    
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
      
      // 4. Add bot's response to chat with emotion suggestions if any
      const botMessage: any = { role: "bot", content: botResponse };
      if (detectedEmotions.length > 0) {
        botMessage.emotionSuggestions = detectedEmotions;
      }
      setMessages(prev => [...prev, botMessage]);
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
          </div>
        </div>
      </div>
      {/* Chat Messages */}
      <div className="flex-1 p-3 md:p-4 overflow-y-auto bg-white dark:bg-gray-900">
        <div className="max-w-2xl mx-auto">        {messages.map((message, index) => (
          <div key={index}>
            <div
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
              
              {/* Message */}
              <div
                className={`px-3 md:px-4 py-2 md:py-3 rounded-2xl max-w-[85%] ${
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
            
            {/* Emotion-based wellness tool suggestions - show after bot messages */}
            {message.role === "bot" && message.emotionSuggestions && message.emotionSuggestions.length > 0 && (
              <div className="mb-6 flex justify-start">
                <div className="mr-3 flex-shrink-0">
                  <div className="w-9 h-9 bg-green-500 rounded-full flex items-center justify-center text-white text-xl">
                    💡
                  </div>
                </div>
                <div className="flex-1 bg-green-50 dark:bg-green-900/20 p-4 rounded-2xl border border-green-200 dark:border-green-800 max-w-[85%]">
                  <h4 className="text-sm font-medium text-green-800 dark:text-green-200 mb-3">
                    I think you should try this activity:
                  </h4>
                  <div className="space-y-2">
                    {message.emotionSuggestions.map((emotion: DetectedEmotion, index: number) => (
                      <button
                        key={index}
                        onClick={() => handleOpenWellnessTool(emotion.tool)}
                        className="w-full text-left p-3 bg-white dark:bg-gray-800 rounded-lg border border-green-200 dark:border-green-700 hover:bg-green-50 dark:hover:bg-green-900/30 transition-colors group"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-green-700 dark:text-green-300 group-hover:text-green-800 dark:group-hover:text-green-200">
                              {emotion.buttonText}
                            </div>
                            <div className="text-sm text-green-600 dark:text-green-400 mt-1">
                              {emotion.description}
                            </div>
                          </div>
                          <div className="text-green-500 group-hover:text-green-600 transition-colors">
                            →
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="mt-3 text-xs text-green-600 dark:text-green-400">
                    These suggestions are based on what you&apos;ve shared. Feel free to explore what feels right for you.
                  </div>
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

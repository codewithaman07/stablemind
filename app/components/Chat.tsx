'use client';

import { useState, useRef, useEffect } from "react";
import { FaArrowUp } from "react-icons/fa";
import { detectCrisis, mentalHealthHelplines } from "../services/crisisDetection";
import { DetectedEmotion } from "../services/emotionDetection";
import { useChatContext } from "../context/ChatContext";
import Logo from "./Logo";

export default function Chat() {
  const { messages, setMessages } = useChatContext();
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px';
    }
  }, [inputMessage]);

  const handleOpenWellnessTool = (toolId: string | null) => {
    if (!toolId) return;
    const event = new CustomEvent('openWellnessTool', { detail: { toolId } });
    window.dispatchEvent(event);
  };

  async function handleSendMessage() {
    if (!inputMessage.trim()) return;

    const userMessage = { role: "user", content: inputMessage };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    const isCrisisMessage = detectCrisis(inputMessage);

    if (isCrisisMessage) {
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
      const previousMessages = messages.filter(msg => msg.role === 'user' || msg.role === 'bot');

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: inputMessage,
          chatHistory: previousMessages,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to get response');
      }

      const botMessage = {
        role: "bot",
        content: data.response,
        ...(data.detectedEmotions?.length > 0 && { emotionSuggestions: data.detectedEmotions })
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Error in chat process:", error);

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
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
      {/* Chat Messages */}
      <div className="flex-1 px-4 py-6 overflow-y-auto" style={{ background: 'var(--bg-primary)' }}>
        <div className="max-w-2xl mx-auto space-y-6">
          {messages.map((message, index) => (
            <div key={index} className="animate-fade-in">
              <div className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                {/* Bot/Alert avatar */}
                {(message.role === "bot" || message.role === "alert") && (
                  <div className="mr-3 flex-shrink-0 mt-1">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white`}
                      style={{ background: message.role === "alert" ? 'var(--red-accent)' : 'var(--accent-primary)' }}>
                      {message.role === "alert" ? "⚠️" : <Logo size={18} />}
                    </div>
                  </div>
                )}

                <div
                  className={`px-4 py-3 max-w-[85%] chat-message text-sm leading-relaxed ${message.role === "user"
                    ? "rounded-2xl rounded-br-md"
                    : "rounded-2xl rounded-bl-md"
                    }`}
                  style={
                    message.role === "user"
                      ? { background: 'var(--accent-primary)', color: '#fff' }
                      : message.role === "alert"
                        ? { background: 'var(--red-surface)', color: 'var(--text-primary)', border: '1px solid rgba(239, 68, 68, 0.2)' }
                        : { background: 'var(--bg-tertiary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)' }
                  }
                >
                  {message.role === "bot" || message.role === "alert" ? (
                    <div dangerouslySetInnerHTML={{ __html: message.content }} className="prose prose-invert max-w-none" />
                  ) : (
                    message.content
                  )}
                </div>

                {/* User avatar */}
                {message.role === "user" && (
                  <div className="ml-3 flex-shrink-0 mt-1">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium" style={{ background: 'var(--bg-surface)', color: 'var(--text-secondary)', border: '1px solid var(--border-primary)' }}>
                      U
                    </div>
                  </div>
                )}
              </div>

              {/* Emotion-based wellness tool suggestions */}
              {message.role === "bot" && message.emotionSuggestions && message.emotionSuggestions.length > 0 && (
                <div className="mt-3 flex justify-start">
                  <div className="mr-3 flex-shrink-0">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm" style={{ background: 'var(--accent-surface)', border: '1px solid var(--accent-border)' }}>
                      💡
                    </div>
                  </div>
                  <div className="flex-1 p-4 rounded-xl max-w-[85%]" style={{ background: 'var(--accent-surface)', border: '1px solid var(--accent-border)' }}>
                    <h4 className="text-xs font-medium mb-3" style={{ color: 'var(--accent-primary)' }}>
                      Suggested activity for you:
                    </h4>
                    <div className="space-y-2">
                      {message.emotionSuggestions.map((emotion: DetectedEmotion, idx: number) => (
                        <button
                          key={idx}
                          onClick={() => handleOpenWellnessTool(emotion.tool)}
                          className="w-full text-left p-3 rounded-lg transition-all group"
                          style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-primary)' }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent-primary)'; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-primary)'; }}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-sm" style={{ color: 'var(--accent-primary)' }}>
                                {emotion.buttonText}
                              </div>
                              <div className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                                {emotion.description}
                              </div>
                            </div>
                            <span style={{ color: 'var(--accent-primary)' }}>→</span>
                          </div>
                        </button>
                      ))}
                    </div>
                    <div className="mt-3 text-xs" style={{ color: 'var(--text-tertiary)' }}>
                      Suggestions based on what you&apos;ve shared.
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="mr-3 flex-shrink-0 mt-1">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white" style={{ background: 'var(--accent-primary)' }}>
                  <Logo size={18} />
                </div>
              </div>
              <div className="px-4 py-3.5 rounded-2xl rounded-bl-md" style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-primary)' }}>
                <div className="flex gap-1.5">
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="px-4 py-3 border-t" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-primary)' }}>
        <div className="max-w-2xl mx-auto">
          <div className="relative flex items-end rounded-2xl overflow-hidden" style={{ background: 'var(--bg-tertiary)' }}>
            <textarea
              ref={textareaRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              className="flex-1 px-4 py-3 bg-transparent focus:outline-none focus-visible:outline-none resize-none text-sm leading-relaxed"
              style={{ color: 'var(--text-primary)', outline: 'none', minHeight: '44px', maxHeight: '200px' }}
              placeholder="Message StableMind..."
              rows={1}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !inputMessage.trim()}
              aria-label="Send message"
              className="m-1.5 w-8 h-8 rounded-lg flex items-center justify-center transition-all disabled:opacity-30"
              style={{
                background: inputMessage.trim() ? 'var(--accent-primary)' : 'var(--bg-hover)',
                color: inputMessage.trim() ? '#fff' : 'var(--text-muted)'
              }}
            >
              <FaArrowUp size={14} />
            </button>
          </div>
          <p className="text-center mt-2 text-xs" style={{ color: 'var(--text-muted)' }}>
            StableMind can make mistakes. Consider verifying important information.
          </p>
        </div>
      </div>
    </div>
  );
}

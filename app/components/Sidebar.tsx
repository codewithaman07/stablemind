import { FaComments, FaBook, FaUserFriends, FaRegSmile, FaHeart, FaTimes, FaPlus, FaTrash } from "react-icons/fa";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

import Logo from './Logo';
import { useChatContext } from '../context/ChatContext';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  onToggle?: () => void;
  clearChat?: () => void;
}

export default function Sidebar({ isOpen = true, onClose, onToggle, clearChat }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const {
    chatSessions,
    currentSessionId,
    loadSession,
    startNewSession,
    deleteSession,
    isLoadingSessions,
  } = useChatContext();

  const handleNewChat = () => {
    startNewSession();
    if (clearChat) clearChat();
    router.push('/dashboard');
  };

  const handleLoadSession = (sessionId: string) => {
    loadSession(sessionId);
    router.push('/dashboard');
  };

  const navItems = [
    { icon: <FaBook size={18} />, label: 'Affirmations', path: '/affirmations' },
    { icon: <FaUserFriends size={18} />, label: 'Peer Support', path: '/community' },
    { icon: <FaRegSmile size={18} />, label: 'Mood Tracker', path: '/mood' },
    { icon: <FaHeart size={18} />, label: 'Wellness Tools', path: '/wellness' },
  ];

  return (
    <aside
      className="w-full h-full flex flex-col p-3 gap-1"
      style={{ background: 'transparent' }}
    >
      {/* Top Header */}
      <div className={`mb-4 flex items-center ${isOpen ? 'justify-between px-2' : 'justify-center'} py-2 overflow-hidden whitespace-nowrap`}>
        {isOpen && (
          <div className="flex items-center gap-2.5 animate-fade-in">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white flex-shrink-0" style={{ background: 'var(--accent-primary)' }}>
              <Logo size={18} />
            </div>
            <span className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>StableMind</span>
          </div>
        )}

        <div className="flex items-center gap-1">
          {/* Toggle Button for Desktop */}
          {onToggle && (
            <button
              onClick={onToggle}
              className="hidden md:flex p-2 rounded-lg transition-colors flex-shrink-0"
              style={{ color: 'var(--text-secondary)' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-tertiary)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
              aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
              title={isOpen ? "Close sidebar" : "Open sidebar"}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <line x1="9" y1="3" x2="9" y2="21" />
                {isOpen ? <polyline points="15 9 12 12 15 15" /> : <polyline points="15 9 12 12 15 15" transform="rotate(180 13.5 12)" />}
              </svg>
            </button>
          )}

          {/* Close button (visible only on mobile) */}
          {onClose && (
            <button
              onClick={onClose}
              className="md:hidden p-2 rounded-lg transition-colors flex-shrink-0"
              style={{ color: 'var(--text-tertiary)' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-tertiary)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-tertiary)'; }}
              aria-label="Close sidebar"
            >
              <FaTimes size={18} />
            </button>
          )}
        </div>
      </div>

      {/* New Chat Button */}
      <button
        onClick={handleNewChat}
        className={`flex items-center ${isOpen ? 'px-3 gap-2' : 'justify-center'} py-2.5 rounded-lg text-sm font-medium transition-all mb-2`}
        style={{
          background: 'var(--accent-primary)',
          color: '#fff',
        }}
        title={!isOpen ? 'New Chat' : undefined}
      >
        <FaPlus size={14} />
        {isOpen && <span className="animate-fade-in">New Chat</span>}
      </button>

      {/* Chat History */}
      {isOpen && (
        <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
          <div className="px-2 py-2 flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
              Recent Chats
            </span>
            {isLoadingSessions && (
              <div className="w-3 h-3 rounded-full animate-spin" style={{ border: '1.5px solid var(--border-primary)', borderTopColor: 'var(--accent-primary)' }} />
            )}
          </div>

          <div className="flex-1 overflow-y-auto space-y-0.5 pr-1" style={{ scrollbarWidth: 'thin' }}>
            {chatSessions.length === 0 && !isLoadingSessions ? (
              <div className="px-3 py-4 text-center">
                <FaComments size={20} className="mx-auto mb-2" style={{ color: 'var(--text-muted)', opacity: 0.5 }} />
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>No chats yet</p>
              </div>
            ) : (
              chatSessions.map((session) => {
                const isActive = session.id === currentSessionId;
                return (
                  <div
                    key={session.id}
                    className={`group flex items-center gap-2 rounded-lg transition-all cursor-pointer ${isActive ? '' : ''}`}
                    style={{
                      background: isActive ? 'var(--bg-tertiary)' : 'transparent',
                    }}
                    onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'var(--bg-tertiary)'; }}
                    onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                  >
                    <button
                      onClick={() => handleLoadSession(session.id!)}
                      className="flex-1 flex items-center gap-2.5 px-3 py-2.5 text-left min-w-0"
                    >
                      <FaComments
                        size={13}
                        className="flex-shrink-0"
                        style={{ color: isActive ? 'var(--accent-primary)' : 'var(--text-muted)' }}
                      />
                      <span
                        className="text-sm truncate"
                        style={{ color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)' }}
                      >
                        {session.title || 'New Chat'}
                      </span>
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteSession(session.id!); }}
                      className="p-1.5 mr-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ color: 'var(--text-muted)' }}
                      onMouseEnter={e => { e.currentTarget.style.color = '#ef4444'; }}
                      onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; }}
                      title="Delete chat"
                    >
                      <FaTrash size={11} />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Collapsed state: show chat icon */}
      {!isOpen && chatSessions.length > 0 && (
        <div className="flex flex-col items-center gap-1 mt-1">
          <button
            onClick={() => chatSessions[0]?.id && handleLoadSession(chatSessions[0].id)}
            className="p-2.5 rounded-lg transition-all"
            style={{ color: 'var(--text-tertiary)' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-tertiary)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-tertiary)'; }}
            title="Recent Chat"
          >
            <FaComments size={18} />
          </button>
        </div>
      )}

      {/* Separator */}
      <div className="my-2" style={{ borderTop: '1px solid var(--border-primary)' }} />

      {/* Navigation */}
      <nav className="flex flex-col gap-1">
        {navItems.map((item, index) => {
          const isActive = item.path ? pathname === item.path : false;

          return (
            <Link
              key={index}
              href={item.path || '/'}
              className={`flex items-center ${isOpen ? 'px-3' : 'justify-center'} py-3 rounded-lg text-sm font-medium transition-all group`}
              style={{
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                background: isActive ? 'var(--bg-tertiary)' : 'transparent',
              }}
              onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'var(--bg-tertiary)'; e.currentTarget.style.color = 'var(--text-primary)'; } }}
              onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; } }}
              title={!isOpen ? item.label : undefined}
            >
              <span className="flex-shrink-0 flex items-center justify-center w-6" style={{ color: isActive ? 'var(--accent-primary)' : 'var(--text-tertiary)' }}>
                {item.icon}
              </span>
              {isOpen && <span className="ml-2 animate-fade-in truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

    </aside>
  );
}

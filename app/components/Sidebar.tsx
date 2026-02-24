import { FaComments, FaBook, FaUserFriends, FaRegSmile, FaHeart, FaTimes } from "react-icons/fa";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

import Logo from './Logo';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  onToggle?: () => void;
  clearChat?: () => void;
}

export default function Sidebar({ isOpen = true, onClose, onToggle, clearChat }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleNewChat = () => {
    if (clearChat) {
      clearChat();
    }
    router.push('/dashboard');
  };

  const navItems = [
    { icon: <FaComments size={18} />, label: 'New Chat', action: handleNewChat, path: null },
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
      <div className={`mb-6 flex items-center ${isOpen ? 'justify-between px-2' : 'justify-center'} py-2 overflow-hidden whitespace-nowrap`}>
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

      {/* Navigation */}
      <nav className="flex flex-col gap-1">
        {navItems.map((item, index) => {
          const isActive = item.path ? pathname === item.path : false;

          const buttonContent = (
            <>
              <span className="flex-shrink-0 flex items-center justify-center w-6" style={{ color: isActive ? 'var(--accent-primary)' : 'var(--text-tertiary)' }}>
                {item.icon}
              </span>
              {isOpen && <span className="ml-2 animate-fade-in truncate">{item.label}</span>}
            </>
          );

          if (item.action) {
            return (
              <button
                key={index}
                onClick={item.action}
                className={`flex items-center ${isOpen ? 'px-3' : 'justify-center'} py-3 rounded-lg text-sm font-medium transition-all group`}
                style={{
                  color: 'var(--text-secondary)',
                  background: 'transparent',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-tertiary)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                title={!isOpen ? item.label : undefined}
              >
                {buttonContent}
              </button>
            );
          }

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
              {buttonContent}
            </Link>
          );
        })}
      </nav>

    </aside>
  );
}

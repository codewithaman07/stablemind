'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUser, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';
import { FaSignInAlt, FaUserPlus, FaBars, FaTimes } from 'react-icons/fa';
import ThemeToggle from './ThemeToggle';
import Logo from './Logo';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const { isSignedIn, user } = useUser();

  return (
    <nav className="fixed w-full z-50 py-3 px-4 md:py-4 md:px-8 glass border-b" style={{ borderColor: 'var(--border-primary)' }}>
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white" style={{ background: 'var(--accent-primary)' }}>
            <Logo size={18} />
          </div>
          <h1 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
            StableMind
          </h1>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-1">
            <Link href="/dashboard" className="px-3 py-2 rounded-lg text-sm font-medium transition-colors" style={{ color: 'var(--text-secondary)' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}>
              Features
            </Link>
            <Link href="/wellness" className="px-3 py-2 rounded-lg text-sm font-medium transition-colors" style={{ color: 'var(--text-secondary)' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}>
              Wellness
            </Link>
            <Link href="/affirmations" className="px-3 py-2 rounded-lg text-sm font-medium transition-colors" style={{ color: 'var(--text-secondary)' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}>
              Affirmations
            </Link>
          </div>

          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <ThemeToggle size={16} />

            {isSignedIn ? (
              <>
                <span className="text-sm hidden lg:block" style={{ color: 'var(--text-tertiary)' }}>
                  {user?.firstName || 'User'}
                </span>
                <UserButton
                  appearance={{
                    elements: {
                      userButtonBox: "w-8 h-8 rounded-lg overflow-hidden",
                      userButtonTrigger: "w-8 h-8 rounded-lg overflow-hidden ring-2 ring-[var(--border-primary)] hover:ring-[var(--accent-primary)] transition-all hover:scale-105",
                      avatarBox: "rounded-lg",
                      userButtonAvatarBox: "rounded-lg"
                    }
                  }}
                />
              </>
            ) : (
              <>
                <SignInButton mode="modal">
                  <button className="px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2" style={{ color: 'var(--text-secondary)', background: 'transparent' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-tertiary)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}>
                    <FaSignInAlt size={14} /> Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 text-white" style={{ background: 'var(--accent-primary)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--accent-hover)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'var(--accent-primary)'}>
                    <FaUserPlus size={14} /> Sign Up
                  </button>
                </SignUpButton>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle size={16} />
          <button
            className="p-2 rounded-lg transition-colors"
            style={{ color: 'var(--text-secondary)' }}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="absolute top-full left-0 right-0 p-4 md:hidden border-b animate-fade-in" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-primary)' }}>
          <div className="flex flex-col gap-1">
            <Link href="/dashboard" className="p-3 rounded-lg text-sm font-medium transition-colors" style={{ color: 'var(--text-secondary)' }} onClick={() => setMenuOpen(false)}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-tertiary)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}>
              Features
            </Link>
            <Link href="/wellness" className="p-3 rounded-lg text-sm font-medium transition-colors" style={{ color: 'var(--text-secondary)' }} onClick={() => setMenuOpen(false)}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-tertiary)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}>
              Wellness
            </Link>
            <Link href="/affirmations" className="p-3 rounded-lg text-sm font-medium transition-colors" style={{ color: 'var(--text-secondary)' }} onClick={() => setMenuOpen(false)}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-tertiary)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}>
              Affirmations
            </Link>

            <div className="my-2 border-t" style={{ borderColor: 'var(--border-primary)' }} />

            {isSignedIn ? (
              <div className="flex items-center justify-between p-3">
                <span style={{ color: 'var(--text-secondary)' }} className="text-sm">
                  {user?.firstName || 'User'}
                </span>
                <UserButton
                  appearance={{
                    elements: {
                      userButtonBox: "w-8 h-8 rounded-lg overflow-hidden",
                      userButtonTrigger: "w-8 h-8 rounded-lg overflow-hidden ring-2 ring-[var(--border-primary)] hover:scale-105 transition-transform",
                      avatarBox: "rounded-lg",
                      userButtonAvatarBox: "rounded-lg"
                    }
                  }}
                />
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <SignInButton mode="modal">
                  <button onClick={() => setMenuOpen(false)} className="w-full p-3 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors" style={{ color: 'var(--text-secondary)', background: 'var(--bg-tertiary)' }}>
                    <FaSignInAlt size={14} /> Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button onClick={() => setMenuOpen(false)} className="w-full p-3 rounded-lg text-sm font-medium flex items-center gap-2 text-white transition-colors" style={{ background: 'var(--accent-primary)' }}>
                    <FaUserPlus size={14} /> Sign Up
                  </button>
                </SignUpButton>
              </div>
            )}

            <button
              onClick={() => { router.push('/dashboard'); setMenuOpen(false); }}
              className="p-3 rounded-lg text-sm font-medium flex items-center gap-2 text-white mt-1 transition-colors" style={{ background: 'var(--accent-primary)' }}>
              Get Support
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

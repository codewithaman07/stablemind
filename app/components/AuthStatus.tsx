'use client';

import { useUser, SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';

export default function AuthStatus() {
  const { user } = useUser();

  return (
    <div className="rounded-xl p-6" style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-primary)' }}>
      <h3 className="text-base font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Authentication Status</h3>

      <SignedOut>
        <div className="space-y-4">
          <p style={{ color: 'var(--text-secondary)' }} className="text-sm">You are not signed in.</p>
          <div className="flex gap-3">
            <SignInButton mode="modal">
              <button className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-all" style={{ background: 'var(--accent-primary)' }}>
                Sign In
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="px-4 py-2 rounded-lg text-sm font-medium transition-all" style={{ background: 'transparent', color: 'var(--accent-primary)', border: '1px solid var(--accent-border)' }}>
                Sign Up
              </button>
            </SignUpButton>
          </div>
        </div>
      </SignedOut>

      <SignedIn>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <UserButton
              appearance={{
                elements: {
                  userButtonBox: "w-10 h-10",
                  userButtonTrigger: "w-10 h-10 rounded-xl ring-2 ring-[var(--border-primary)]"
                }
              }}
            />
            <div>
              <p className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
                Welcome, {user?.firstName || 'User'}!
              </p>
              <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                {user?.primaryEmailAddress?.emailAddress}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--accent-primary)' }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--accent-primary)' }} />
            You are signed in
          </div>
        </div>
      </SignedIn>
    </div>
  );
}
'use client';

import { useUser, SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';

export default function AuthStatus() {
  const { user, isSignedIn } = useUser();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Authentication Status</h3>
      
      <SignedOut>
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">You are not signed in.</p>
          <div className="flex gap-3">
            <SignInButton mode="modal">
              <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium">
                Sign In
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="px-4 py-2 border border-indigo-600 text-indigo-600 hover:bg-indigo-50 rounded-lg font-medium">
                Sign Up
              </button>
            </SignUpButton>
          </div>
        </div>
      </SignedOut>

      <SignedIn>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <UserButton />
            <div>
              <p className="text-gray-900 dark:text-white font-medium">
                Welcome, {user?.firstName || user?.emailAddresses[0]?.emailAddress || 'User'}!
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                You are successfully signed in.
              </p>
            </div>
          </div>
          
          <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-3 rounded">
            <p><strong>User ID:</strong> {user?.id}</p>
            <p><strong>Email:</strong> {user?.emailAddresses[0]?.emailAddress}</p>
            <p><strong>Created:</strong> {user?.createdAt?.toLocaleDateString()}</p>
          </div>
        </div>
      </SignedIn>
    </div>
  );
}

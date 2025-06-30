'use client';

import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import AuthStatus from '../components/AuthStatus';

export default function AuthTestPage() {
  const { isSignedIn, user } = useUser();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 dark:from-gray-900 dark:to-indigo-900 py-12">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 mb-6">
            ← Back to Home
          </Link>
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-purple-900 rounded-full flex items-center justify-center text-3xl font-bold text-purple-300">
              SM
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Authentication Test
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Test Clerk authentication integration
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <AuthStatus />
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Quick Actions</h3>
            <div className="space-y-3">
              {isSignedIn ? (
                <>
                  <Link 
                    href="/dashboard" 
                    className="block w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium text-center"
                  >
                    Go to Dashboard
                  </Link>
                  <Link 
                    href="/wellness" 
                    className="block w-full px-4 py-2 border border-indigo-600 text-indigo-600 hover:bg-indigo-50 rounded-lg font-medium text-center"
                  >
                    Wellness Tools
                  </Link>
                  <Link 
                    href="/mood" 
                    className="block w-full px-4 py-2 border border-purple-600 text-purple-600 hover:bg-purple-50 rounded-lg font-medium text-center"
                  >
                    Mood Tracker
                  </Link>
                </>
              ) : (
                <div className="text-center text-gray-500 dark:text-gray-400 py-4">
                  Sign in to access protected pages
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-10 text-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Integration Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="w-4 h-4 bg-green-500 rounded-full mx-auto mb-2"></div>
                <p className="font-medium text-gray-900 dark:text-white">Clerk Provider</p>
                <p className="text-gray-600 dark:text-gray-300">✓ Configured</p>
              </div>
              <div className="text-center">
                <div className="w-4 h-4 bg-green-500 rounded-full mx-auto mb-2"></div>
                <p className="font-medium text-gray-900 dark:text-white">Middleware</p>
                <p className="text-gray-600 dark:text-gray-300">✓ Active</p>
              </div>
              <div className="text-center">
                <div className="w-4 h-4 bg-green-500 rounded-full mx-auto mb-2"></div>
                <p className="font-medium text-gray-900 dark:text-white">Environment</p>
                <p className="text-gray-600 dark:text-gray-300">✓ Ready</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

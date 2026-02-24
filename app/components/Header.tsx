'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUser, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';
import { FaBrain, FaSignInAlt, FaUserPlus, FaBars, FaTimes } from 'react-icons/fa';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const { isSignedIn, user } = useUser();

  return (
    <nav className="fixed w-full z-50 p-4 md:py-5 md:px-8 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <FaBrain className="text-2xl text-indigo-600 dark:text-indigo-400" />
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
            StableMind
          </h1>
        </div>

        <div className="hidden md:flex items-center space-x-8">
          <div className="space-x-6">
            <Link href="/dashboard" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Features</Link>
            <Link href="/dashboard" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Resources</Link>
          </div>

          <div className="flex items-center space-x-3">
            {isSignedIn ? (
              <>
                <span className="text-sm text-gray-600 dark:text-gray-300 hidden sm:block">
                  Welcome, {user?.firstName || 'User'}!
                </span>
                <UserButton
                  appearance={{
                    elements: {
                      userButtonBox: "w-8 h-8",
                      userButtonTrigger: "w-8 h-8 rounded-full border-2 border-indigo-200 hover:border-indigo-300"
                    }
                  }}
                />
              </>
            ) : (
              <>
                <SignInButton mode="modal">
                  <button className="px-4 py-2 text-indigo-600 dark:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors flex items-center">
                    <FaSignInAlt className="mr-2" /> Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg transition-all shadow-md hover:shadow-lg flex items-center">
                    <FaUserPlus className="mr-2" /> Sign Up
                  </button>
                </SignUpButton>
              </>
            )}
          </div>
        </div>

        <button
          className="md:hidden text-gray-500 dark:text-gray-400 focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>


      {menuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white dark:bg-gray-900 shadow-lg rounded-b-lg p-4 md:hidden">
          <div className="flex flex-col space-y-3">
            <Link
              href="/dashboard"
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-700 dark:text-gray-200"
              onClick={() => setMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              href="/dashboard"
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-700 dark:text-gray-200"
              onClick={() => setMenuOpen(false)}
            >
              Resources
            </Link>
            <hr className="border-gray-200 dark:border-gray-700" />
            {isSignedIn ? (
              <div className="flex items-center justify-between p-2">
                <span className="text-gray-700 dark:text-gray-200">
                  Welcome, {user?.firstName || 'User'}!
                </span>
                <UserButton
                  appearance={{
                    elements: {
                      userButtonBox: "w-8 h-8",
                      userButtonTrigger: "w-8 h-8 rounded-full border-2 border-indigo-200 hover:border-indigo-300"
                    }
                  }}
                />
              </div>
            ) : (
              <>
                <SignInButton mode="modal">
                  <button
                    onClick={() => setMenuOpen(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-700 dark:text-gray-200 flex items-center w-full"
                  >
                    <FaSignInAlt className="mr-2" /> Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button
                    onClick={() => setMenuOpen(false)}
                    className="p-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg flex items-center w-full"
                  >
                    <FaUserPlus className="mr-2" /> Sign Up
                  </button>
                </SignUpButton>
              </>
            )}
            <button
              onClick={() => {
                router.push('/dashboard');
                setMenuOpen(false);
              }}
              className="p-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg flex items-center"
            >
              Get Support
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

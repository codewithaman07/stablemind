import { FaComments, FaBook, FaUserFriends, FaRegSmile, FaRegLifeRing, FaHeart, FaTimes, FaSignOutAlt, FaSignInAlt } from "react-icons/fa";
import { useUser, SignOutButton, SignInButton } from '@clerk/nextjs';
import Link from "next/link";
import { useRouter } from "next/navigation";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  clearChat?: () => void;
  isGuestMode?: boolean;
}

export default function Sidebar({ isOpen, onClose, clearChat, isGuestMode }: SidebarProps) {
  const router = useRouter();
  const { user, isSignedIn } = useUser();
  
  const handleNewChat = () => {
    if (clearChat) {
      clearChat(); 
    }
    router.push('/dashboard'); 
  };
  return (
    <aside className={`w-64 min-h-screen bg-gray-900 border-r border-gray-800 flex flex-col p-4 gap-2 
      ${isOpen !== undefined ? (isOpen ? 'fixed right-0 top-0 h-full z-20 shadow-lg' : 'hidden') : ''} 
      md:static md:block`}>
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-purple-900 rounded-full flex items-center justify-center text-2xl font-bold text-purple-300">SM</div>
          <span className="text-xl font-bold text-white">StableMind</span>
        </div>
        
        {/* Close button - only visible on mobile when sidebar is open */}
        {onClose && (
          <button 
            onClick={onClose}
            className="md:hidden p-2 text-gray-400 hover:text-white"
            aria-label="Close sidebar"
          >
            <FaTimes size={20} />
          </button>
        )}
      </div>      <nav className="flex flex-col gap-2">
        <button 
          onClick={handleNewChat}
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 text-gray-200 font-medium text-left"
        >
          <FaComments className="text-indigo-400" /> New Chat
        </button>
        <Link href="/affirmations" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 text-gray-200 font-medium">
          <FaBook className="text-green-600" /> Affirmations
        </Link>
        <Link href="/community" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 text-gray-200 font-medium">
          <FaUserFriends className="text-green-400" /> Peer Support
        </Link>
        <Link href="/mood" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 text-gray-200 font-medium">
          <FaRegSmile className="text-yellow-400" /> Mood Tracker
        </Link>
        <Link href="/wellness" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 text-gray-200 font-medium">
          <FaHeart className="text-red-400" /> Wellness Tools
        </Link>        <Link href="/resources" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 text-gray-200 font-medium">
          <FaRegLifeRing className="text-orange-400" /> Resources
        </Link>
      </nav>
      <div className="mt-auto pt-8 border-t border-gray-800">
        <div className="text-xs text-gray-500 mb-1">
          {isSignedIn ? 'Signed in as' : 'Not signed in'}
        </div>
        <div className="font-semibold text-gray-200 mb-3">
          {isSignedIn 
            ? (user?.firstName || user?.emailAddresses[0]?.emailAddress || 'User')
            : isGuestMode 
              ? 'Guest User' 
              : 'Guest'
          }
        </div>
        {isSignedIn ? (
          <SignOutButton>
            <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
              <FaSignOutAlt />
              Sign Out
            </button>
          </SignOutButton>
        ) : isGuestMode && (
          <div className="space-y-2">
            <SignInButton mode="modal">
              <button className="flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
                <FaSignInAlt />
                Sign In for Full Access
              </button>
            </SignInButton>
          </div>
        )}
      </div>
    </aside>
  );
}

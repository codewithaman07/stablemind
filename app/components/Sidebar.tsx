import { FaComments, FaBook, FaUserFriends, FaRegSmile, FaRegLifeRing, FaHeart, FaTimes, FaFileUpload } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  clearChat?: () => void;
}

export default function Sidebar({ isOpen, onClose, clearChat }: SidebarProps) {
  const router = useRouter();
  
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
        <Link href="/documents" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 text-gray-200 font-medium">
          <FaFileUpload className="text-purple-400" /> My Documents
        </Link>
      </nav>
      <div className="mt-auto pt-8">
        <div className="text-xs text-gray-500">Logged in as</div>
        <div className="font-semibold text-gray-200">Guest</div>
      </div>
    </aside>
  );
}

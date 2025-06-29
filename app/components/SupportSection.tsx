'use client';

import { useRouter } from "next/navigation";
import { FaComment, FaHeartbeat, FaArrowRight } from "react-icons/fa";

export default function SupportSection() {
  const router = useRouter();
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-violet-600 to-indigo-700 p-10 rounded-3xl shadow-xl mt-12 mb-20">
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-purple-500 rounded-full opacity-20"></div>
      <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-48 h-48 bg-indigo-500 rounded-full opacity-20"></div>
      
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between">
        <div className="md:w-2/3 mb-6 md:mb-0 md:pr-10">
          <div className="flex items-center mb-3">
            <FaHeartbeat className="text-pink-300 mr-3 text-xl" />
            <span className="text-pink-200 uppercase tracking-wider text-sm font-medium">Placement Support</span>
          </div>
          <h3 className="text-3xl md:text-4xl font-bold mb-4 text-white leading-tight">
            Need Someone to Talk To?
          </h3>
          <p className="text-indigo-100 mb-6 text-lg">
            Our trained AI is here to listen and support you 24/7. Your
            mental health matters more than any job placement. Share your concerns in a safe space.
          </p>
          <button
            className="flex items-center px-8 py-4 bg-white text-indigo-700 rounded-full hover:bg-indigo-50 transition-colors font-medium shadow-lg group"
            onClick={() => router.push("/dashboard")}
          >
            <FaComment className="mr-2" />
            Chat with me 
            <FaArrowRight className="ml-2 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all" />
          </button>
        </div>
        
        <div className="md:w-1/3 flex justify-center">
          <div className="w-40 h-40 rounded-full bg-white/20 flex items-center justify-center">
            <div className="w-32 h-32 rounded-full bg-white/30 flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center text-5xl text-indigo-600">
                💬
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

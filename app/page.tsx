'use client';

import Header from "./components/Header";
import FeatureCards from "./components/FeatureCards";
import SupportSection from "./components/SupportSection";
import Footer from "./components/Footer";

import { FaChevronDown } from "react-icons/fa";
import Link from "next/link";

export default function Home() {
  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-purple-50 dark:from-gray-900 dark:to-indigo-900">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-20 md:pt-32 md:pb-32">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-br from-indigo-200 to-purple-200 dark:from-indigo-800 dark:to-purple-900 rounded-full opacity-20 blur-3xl -translate-y-1/2 translate-x-1/4"></div>
          <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-blue-200 to-cyan-200 dark:from-blue-800 dark:to-cyan-900 rounded-full opacity-20 blur-3xl translate-y-1/3 -translate-x-1/4"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block bg-gradient-to-r from-indigo-600 to-violet-600 mb-6 px-4 py-1.5 rounded-full text-white text-sm font-medium">
              Your Mental Health Companion for Placement Season
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-300 dark:to-purple-300">
              You&apos;re Not Alone in This Journey
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
              The placement season can be challenging, but your worth isn&apos;t defined by
              job offers. Let&apos;s work together to maintain your mental well-being.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/dashboard">
                <span className="inline-block px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-full text-lg font-medium transition-all shadow-lg hover:shadow-xl cursor-pointer">
                  Chat with me
                </span>
              </Link>
              <button 
                onClick={scrollToFeatures}
                className="px-8 py-4 bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 rounded-full text-lg font-medium transition-all hover:bg-indigo-50 dark:hover:bg-gray-700"
              >
                Explore Features
              </button>
            </div>
            
            <div className="mt-20 animate-bounce">
              <FaChevronDown className="mx-auto text-indigo-500 dark:text-indigo-400 text-3xl" />
            </div>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-6">
        <div id="features" className="pt-10">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-300 dark:to-purple-300 inline-block">
              Tools For Your Mental Wellbeing
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              StableMind offers a comprehensive suite of resources designed specifically for students navigating placement season pressures.
            </p>
          </div>
          
          <FeatureCards />
          <SupportSection />
        </div>
      </main>
      <Footer />
    </div>
  );
}

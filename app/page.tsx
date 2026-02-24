'use client';

import { useUser, SignInButton, SignUpButton } from '@clerk/nextjs';
import Header from "./components/Header";
import FeatureCards from "./components/FeatureCards";
import SupportSection from "./components/SupportSection";
import Footer from "./components/Footer";
import Link from "next/link";
import { FaArrowDown } from "react-icons/fa";

export default function Home() {
  const { isSignedIn, user } = useUser();

  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-28 pb-20 md:pt-40 md:pb-32">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-[0.04]" style={{ background: 'radial-gradient(circle, var(--accent-primary) 0%, transparent 70%)' }} />

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full text-sm font-medium" style={{ background: 'var(--accent-surface)', color: 'var(--accent-primary)', border: '1px solid var(--accent-border)' }}>
              <span className="w-2 h-2 rounded-full" style={{ background: 'var(--accent-primary)' }} />
              Your Mental Health Companion
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight" style={{ color: 'var(--text-primary)' }}>
              You&apos;re Not Alone
              <br />
              <span style={{ color: 'var(--accent-primary)' }}>in This Journey</span>
            </h1>

            <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              The placement season can be challenging, but your worth isn&apos;t defined by
              job offers. Let&apos;s work together to maintain your mental well-being.
            </p>

            <div className="flex flex-wrap justify-center gap-3">
              {isSignedIn ? (
                <>
                  <Link href="/dashboard">
                    <span className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-base font-medium text-white transition-all cursor-pointer" style={{ background: 'var(--accent-primary)' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--accent-hover)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'var(--accent-primary)'}>
                      Continue to Dashboard →
                    </span>
                  </Link>
                  <div className="px-6 py-3.5 rounded-xl text-base font-medium" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)', border: '1px solid var(--border-primary)' }}>
                    Welcome back, {user?.firstName || 'User'}!
                  </div>
                </>
              ) : (
                <div className="flex flex-col sm:flex-row gap-3 items-center">
                  <div className="flex gap-3">
                    <SignInButton mode="modal">
                      <button className="px-6 py-3.5 rounded-xl text-base font-medium text-white transition-all" style={{ background: 'var(--accent-primary)' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--accent-hover)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'var(--accent-primary)'}>
                        Sign In
                      </button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <button className="px-6 py-3.5 rounded-xl text-base font-medium transition-all" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-tertiary)'}>
                        Get Started
                      </button>
                    </SignUpButton>
                  </div>
                  <span className="text-sm" style={{ color: 'var(--text-muted)' }}>or</span>
                  <Link href="/dashboard">
                    <button className="px-5 py-3 rounded-xl text-sm font-medium transition-all" style={{ background: 'transparent', color: 'var(--text-tertiary)', border: '1px solid var(--border-primary)' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-tertiary)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-tertiary)'; }}>
                      Try as Guest
                    </button>
                  </Link>
                </div>
              )}
            </div>

            <button onClick={scrollToFeatures} className="mt-16 mx-auto flex items-center justify-center w-10 h-10 rounded-full transition-all animate-bounce" style={{ border: '1px solid var(--border-primary)', color: 'var(--text-muted)' }}>
              <FaArrowDown size={14} />
            </button>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-6">
        <div id="features" className="pt-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
              Tools For Your Mental Wellbeing
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
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

'use client';

import { useRouter } from "next/navigation";
import { FaComment, FaArrowRight } from "react-icons/fa";

export default function SupportSection() {
  const router = useRouter();
  return (
    <div className="relative overflow-hidden rounded-2xl mt-8 mb-20 p-8 md:p-12" style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-primary)' }}>
      {/* Subtle background accent glow */}
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-[0.06]" style={{ background: 'var(--accent-primary)', filter: 'blur(80px)' }} />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="md:w-2/3">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full" style={{ background: 'var(--accent-primary)' }} />
            <span className="text-sm font-medium uppercase tracking-wider" style={{ color: 'var(--accent-primary)' }}>Placement Support</span>
          </div>
          <h3 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            Need Someone to Talk To?
          </h3>
          <p className="mb-6 text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Our trained AI is here to listen and support you 24/7. Your
            mental health matters more than any job placement. Share your concerns in a safe space.
          </p>
          <button
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-medium text-white transition-all group"
            style={{ background: 'var(--accent-primary)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--accent-hover)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--accent-primary)'}
            onClick={() => router.push("/dashboard")}
          >
            <FaComment size={14} />
            Chat with me
            <FaArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1" />
          </button>
        </div>

        <div className="md:w-1/3 flex justify-center">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full flex items-center justify-center" style={{ background: 'var(--accent-surface)', border: '2px solid var(--accent-border)' }}>
            <div className="w-24 h-24 md:w-28 md:h-28 rounded-full flex items-center justify-center" style={{ background: 'var(--bg-surface)' }}>
              <span className="text-5xl">💬</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

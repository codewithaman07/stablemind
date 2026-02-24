import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4" style={{ background: 'var(--bg-primary)' }}>
      {/* Subtle background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-[0.04]" style={{ background: 'radial-gradient(circle, var(--accent-primary) 0%, transparent 70%)' }} />

      <div className="text-center max-w-xl mx-auto relative z-10">
        {/* Icon */}
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto rounded-2xl flex items-center justify-center text-5xl" style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-primary)' }}>
            🚧
          </div>
        </div>

        {/* Content */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full text-sm font-medium" style={{ background: 'var(--accent-surface)', color: 'var(--accent-primary)', border: '1px solid var(--accent-border)' }}>
            StableMind Development
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            Work In Progress
          </h1>

          <h2 className="text-lg md:text-xl font-medium mb-4" style={{ color: 'var(--text-secondary)' }}>
            We&apos;re Building Something Amazing
          </h2>

          <p className="text-base leading-relaxed mb-6" style={{ color: 'var(--text-tertiary)' }}>
            This page is currently under development. We&apos;re working hard to bring you new features that will enhance your mental wellness journey.
          </p>

          {/* Loading dots */}
          <div className="flex justify-center gap-2 mb-8">
            <div className="typing-dot" />
            <div className="typing-dot" />
            <div className="typing-dot" />
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-base font-medium text-white transition-all"
              style={{ background: 'var(--accent-primary)' }}
            >
              🏠 Return Home
            </Link>

            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-base font-medium transition-all"
              style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)' }}
            >
              ✨ Explore Dashboard
            </Link>
          </div>

          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Meanwhile, try these available features:
          </p>

          <div className="flex flex-wrap justify-center gap-2">
            {[
              { href: '/wellness', label: '🧘 Wellness Tools' },
              { href: '/affirmations', label: '💭 Affirmations' },
              { href: '/mood', label: '📊 Mood Tracker' },
            ].map((item, i) => (
              <Link
                key={i}
                href={item.href}
                className="px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
                style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)', border: '1px solid var(--border-primary)' }}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16">
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            💚 Your mental health matters
          </p>
        </div>
      </div>
    </div>
  )
}
'use client';

import { useRouter } from 'next/navigation';

export default function FeatureCards() {
  const router = useRouter();

  const features = [
    {
      icon: "🎯",
      title: "Daily Goals",
      description: "Set achievable goals and track your placement preparation progress",
      path: "/dashboard"
    },
    {
      icon: "💭",
      title: "Mindful Moments",
      description: "Practice guided meditation and stress-relief techniques during placement season",
      path: "/dashboard"
    },
    {
      icon: "🤝",
      title: "Peer Support",
      description: "Connect with others who understand the placement journey challenges",
      path: "/dashboard"
    },
    {
      icon: "📚",
      title: "Affirmations",
      description: "Motivational quotes and articles to keep you inspired",
      path: "/affirmations"
    },
    {
      icon: "📊",
      title: "Mood Tracker",
      description: "Monitor your mental wellbeing throughout your placement journey",
      path: "/mood"
    },
    {
      icon: "📝",
      title: "Document Upload",
      description: "Upload resumes and materials for personalized placement advice",
      path: "/dashboard"
    }
  ];

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-16 mt-8">
      {features.map((feature, index) => (
        <div
          key={index}
          className="group relative rounded-xl p-6 cursor-pointer transition-all duration-300"
          style={{
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--border-primary)',
          }}
          onClick={() => router.push(feature.path)}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'var(--accent-primary)';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.3)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'var(--border-primary)';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-lg" style={{ background: 'var(--accent-surface)' }}>
            <span className="text-2xl">{feature.icon}</span>
          </div>
          <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
            {feature.title}
          </h3>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {feature.description}
          </p>
          <div className="mt-4 flex items-center gap-1 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--accent-primary)' }}>
            Explore <span>→</span>
          </div>
        </div>
      ))}
    </div>
  );
}

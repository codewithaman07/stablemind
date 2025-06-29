'use client';

import { useRouter } from 'next/navigation';

export default function FeatureCards() {
  const router = useRouter();
  
  const features = [
    {
      icon: "🎯",
      title: "Daily Goals",
      description: "Set achievable goals and track your placement preparation progress",
      color: "from-blue-500 to-indigo-600",
      textColor: "text-blue-100",
      path: "/goals"
    },
    {
      icon: "💭",
      title: "Mindful Moments",
      description: "Practice guided meditation and stress-relief techniques during placement season",
      color: "from-purple-500 to-indigo-600",
      textColor: "text-purple-100",
      path: "/mindful"
    },
    {
      icon: "🤝",
      title: "Peer Support",
      description: "Connect with others who understand the placement journey challenges",
      color: "from-pink-500 to-rose-600",
      textColor: "text-pink-100",
      path: "/community"
    },
    {
      icon: "📚",
      title: "Resources Library",
      description: "Access interview guides, resume templates and placement materials",
      color: "from-emerald-500 to-teal-600",
      textColor: "text-emerald-100",
      path: "/library"
    },
    {
      icon: "📊",
      title: "Mood Tracker",
      description: "Monitor your mental wellbeing throughout your placement journey",
      color: "from-amber-500 to-orange-600",
      textColor: "text-amber-100",
      path: "/mood"
    },
    {
      icon: "📝",
      title: "Document Upload",
      description: "Upload resumes and materials for personalized placement advice",
      color: "from-cyan-500 to-blue-600",
      textColor: "text-cyan-100",
      path: "/documents"
    }
  ];

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16 mt-12">
      {features.map((feature, index) => (
        <div 
          key={index} 
          className="group relative overflow-hidden rounded-2xl shadow-lg transition-transform duration-300 hover:-translate-y-2 cursor-pointer"
          onClick={() => router.push(feature.path)}
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-90`}></div>
          <div className="relative p-8">
            <div className="mb-4 inline-block rounded-full bg-white/20 p-3">
              <span className="text-3xl">{feature.icon}</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              {feature.title}
            </h3>
            <p className={`${feature.textColor} text-sm`}>
              {feature.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

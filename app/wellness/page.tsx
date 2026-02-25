'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import BreathingExercise from '../components/wellness/BreathingExercise';
import JournalPrompt from '../components/wellness/JournalPrompt';
import GroundingTechnique from '../components/wellness/GroundingTechnique';
import PomodoroTimer from '../components/wellness/PomodoroTimer';
import BodyScan from '../components/wellness/BodyScan';
import Visualization from '../components/wellness/Visualization';
import { WellnessTool, wellnessTools } from '../components/wellness/WellnessToolsConfig';
import { calmingVideos } from '../components/wellness/CalmingVideos';
import { ChatProvider } from '../context/ChatContext';

function WellnessToolsContent() {
  const searchParams = useSearchParams();
  const toolParam = searchParams.get('tool') as WellnessTool | null;
  const [activeTool, setActiveTool] = useState<WellnessTool>(null);

  useEffect(() => {
    if (toolParam && wellnessTools.some(tool => tool.id === toolParam)) {
      setActiveTool(toolParam);
    }
  }, [toolParam]);

  const handleCloseTool = () => {
    setActiveTool(null);
  };

  const renderTool = () => {
    switch (activeTool) {
      case 'breathing':
        return <BreathingExercise onBack={handleCloseTool} />;
      case 'sounds':
        return (
          <div className="p-4 sm:p-8 max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-center" style={{ color: 'var(--text-primary)' }}>Calming Sounds</h3>

            {calmingVideos.map((video) => (
              <div key={video.id} className="mb-6">
                <h4 className="text-base sm:text-lg font-medium mb-3" style={{ color: 'var(--text-secondary)' }}>{video.title}</h4>
                <div className="relative w-full pt-[56.25%] mb-4">
                  <iframe
                    className="absolute top-0 left-0 w-full h-full rounded-xl"
                    src={`https://www.youtube.com/embed/${video.videoId}?${video.params}`}
                    title={video.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            ))}

            <p className="text-sm sm:text-base mb-6 text-center" style={{ color: 'var(--text-tertiary)' }}>
              Choose from our collection of calming videos to help you relax, focus, and reduce stress.
            </p>

            <div className="flex justify-center">
              <button
                onClick={handleCloseTool}
                className="w-full sm:w-auto px-6 py-3 rounded-xl font-medium text-white transition-all"
                style={{ background: 'var(--accent-primary)' }}
              >
                Back to Tools
              </button>
            </div>
          </div>
        );
      case 'grounding':
        return <GroundingTechnique onBack={handleCloseTool} />;
      case 'journal':
        return <JournalPrompt onBack={handleCloseTool} />;
      case 'pomodoro':
        return <PomodoroTimer onBack={handleCloseTool} />;
      case 'bodyscan':
        return <BodyScan onBack={handleCloseTool} />;
      case 'visualization':
        return <Visualization onBack={handleCloseTool} />;
      default:
        return (
          <div className="p-4 sm:p-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Wellness Tools</h2>
            <p className="text-base mb-8" style={{ color: 'var(--text-secondary)' }}>Select a tool to help manage stress and anxiety</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-3xl mx-auto">
              {wellnessTools.map(tool => (
                <div
                  key={tool.id}
                  onClick={() => setActiveTool(tool.id as WellnessTool)}
                  className="p-5 rounded-xl cursor-pointer transition-all flex items-center gap-4"
                  style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-primary)' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent-primary)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-primary)'}
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center text-2xl" style={{ background: 'var(--accent-surface)' }}>
                    {tool.icon}
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>{tool.name}</h3>
                    <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Click to start</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
    }
  };

  return (
    <ChatProvider>
      <DashboardLayout>
        <div className="max-w-4xl mx-auto p-4">
          {renderTool()}
        </div>
      </DashboardLayout>
    </ChatProvider>
  );
}

export default function WellnessTools() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
        <div className="w-6 h-6 rounded-full animate-spin" style={{ border: '2px solid var(--border-primary)', borderTopColor: 'var(--accent-primary)' }} />
      </div>
    }>
      <WellnessToolsContent />
    </Suspense>
  );
}

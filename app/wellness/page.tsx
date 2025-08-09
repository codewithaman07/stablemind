'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import BreathingExercise from '../components/wellness/BreathingExercise';
import JournalPrompt from '../components/wellness/JournalPrompt';
import DailyAffirmations from '../components/wellness/DailyAffirmations';
import GroundingTechnique from '../components/wellness/GroundingTechnique';
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

  // Render the active tool or a placeholder
  const renderTool = () => {
    switch (activeTool) {
      case 'breathing':
        return <BreathingExercise onBack={handleCloseTool} />;
      case 'sounds':
        return (
          <div className="p-4 sm:p-8 text-white bg-gray-900 rounded-lg max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-center">Calming Sounds</h3>
            
            {calmingVideos.map((video) => (
              <div key={video.id} className="mb-6">
                <h4 className="text-base sm:text-lg font-medium mb-3 text-gray-300">{video.title}</h4>
                <div className="relative w-full pt-[56.25%] mb-4">
                  <iframe 
                    className="absolute top-0 left-0 w-full h-full rounded-lg"
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
            
            <p className="text-sm sm:text-base mb-6 text-center text-gray-300">
              Choose from our collection of calming videos to help you relax, focus, and reduce stress.
            </p>
            
            <div className="flex justify-center">
              <button 
                onClick={handleCloseTool}
                className="w-full sm:w-auto px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium"
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
      case 'affirmations':
        return <DailyAffirmations onBack={handleCloseTool} />;
      default:
        return (
          <div className="p-4 sm:p-8 text-center text-white">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Wellness Tools</h2>
            <p className="text-base sm:text-lg mb-6 sm:mb-8">Select a tool to help manage stress and anxiety</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto">
              {wellnessTools.map(tool => (
                <div 
                  key={tool.id}
                  onClick={() => setActiveTool(tool.id as WellnessTool)}
                  className="bg-gray-900 p-4 sm:p-6 rounded-xl cursor-pointer hover:bg-gray-800 transition-colors flex items-center gap-3 sm:gap-4"
                >
                  <div className={`w-12 h-12 sm:w-16 sm:h-16 ${tool.bgColor} rounded-full flex items-center justify-center ${tool.textColor} text-2xl sm:text-3xl`}>
                    {tool.icon}
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold">{tool.name}</h3>
                    <p className="text-gray-400 text-sm sm:text-base">Click to start</p>
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
        <div className="max-w-6xl mx-auto p-4">
          {renderTool()}
        </div>
      </DashboardLayout>
    </ChatProvider>
  );
}

export default function WellnessTools() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <WellnessToolsContent />
    </Suspense>
  );
}

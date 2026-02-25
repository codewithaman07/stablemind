'use client';

// This will be exported and used by both the ToolsPanel and Chat components
export type WellnessTool = 'breathing' | 'sounds' | 'grounding' | 'journal' | 'pomodoro' | 'bodyscan' | 'visualization' | null;

// This ensures consistency between sidebar tools and chat suggestion buttons
export const wellnessTools = [
  {
    id: 'breathing',
    name: 'Breathing Exercise',
    icon: '🫁',
    bgColor: 'bg-blue-900',
    textColor: 'text-blue-300'
  },
  {
    id: 'sounds',
    name: 'Calming Sounds',
    icon: '🎵',
    bgColor: 'bg-green-900',
    textColor: 'text-green-300'
  },
  {
    id: 'grounding',
    name: 'Grounding Technique',
    icon: '🧠',
    bgColor: 'bg-yellow-900',
    textColor: 'text-yellow-300'
  },
  {
    id: 'journal',
    name: 'Journal Prompt',
    icon: '📝',
    bgColor: 'bg-purple-900',
    textColor: 'text-purple-300'
  },
  {
    id: 'pomodoro',
    name: 'Focus Timer',
    icon: '⏱️',
    bgColor: 'bg-red-900',
    textColor: 'text-red-300'
  },
  {
    id: 'bodyscan',
    name: 'Body Scan',
    icon: '🧘',
    bgColor: 'bg-teal-900',
    textColor: 'text-teal-300'
  },
  {
    id: 'visualization',
    name: 'Visualization',
    icon: '🌄',
    bgColor: 'bg-indigo-900',
    textColor: 'text-indigo-300'
  }
];

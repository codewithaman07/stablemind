'use client';

import { useState } from 'react';
import { chatWithGemini } from '../../services/geminiService';

interface JournalPromptProps {
  onBack: () => void;
}

type Mood = 'happy' | 'sad' | 'anxious' | 'stressed' | 'confused' | 'angry' | 'excited' | 'calm';

interface MoodOption {
  id: Mood;
  label: string;
  emoji: string;
  color: string;
  prompt: string;
}

const moodOptions: MoodOption[] = [
  {
    id: 'happy',
    label: 'Happy',
    emoji: '😊',
    color: 'bg-yellow-500',
    prompt: 'What made you feel happy today? Write about the moments, people, or experiences that brought joy to your life.'
  },
  {
    id: 'sad',
    label: 'Sad',
    emoji: '😢',
    color: 'bg-blue-500',
    prompt: 'It\'s okay to feel sad. Write about what\'s weighing on your heart. Sometimes putting feelings into words can help lighten the load.'
  },
  {
    id: 'anxious',
    label: 'Anxious',
    emoji: '😰',
    color: 'bg-orange-500',
    prompt: 'What thoughts are making you feel anxious? Write about your worries and fears. Getting them out of your head and onto paper can bring clarity.'
  },
  {
    id: 'stressed',
    label: 'Stressed',
    emoji: '😤',
    color: 'bg-red-500',
    prompt: 'What\'s causing you stress right now? Write about the pressures you\'re facing and how they\'re affecting you. Let it all out.'
  },
  {
    id: 'confused',
    label: 'Confused',
    emoji: '🤔',
    color: 'bg-purple-500',
    prompt: 'What\'s unclear or confusing in your life right now? Write about the decisions you\'re facing or situations you\'re trying to understand.'
  },
  {
    id: 'angry',
    label: 'Angry',
    emoji: '😠',
    color: 'bg-red-600',
    prompt: 'What\'s making you angry? Write about what triggered these feelings and how it\'s affecting you. Express yourself freely.'
  },
  {
    id: 'excited',
    label: 'Excited',
    emoji: '🤩',
    color: 'bg-pink-500',
    prompt: 'What\'s got you excited? Write about what you\'re looking forward to or what\'s energizing you right now.'
  },
  {
    id: 'calm',
    label: 'Calm',
    emoji: '😌',
    color: 'bg-green-500',
    prompt: 'Enjoy this peaceful moment. Write about what\'s bringing you calm or reflect on your current state of mind.'
  }
];

export default function JournalPrompt({ onBack }: JournalPromptProps) {
  const [step, setStep] = useState<'mood' | 'writing' | 'suggestions'>('mood');
  const [selectedMood, setSelectedMood] = useState<MoodOption | null>(null);
  const [journalEntry, setJournalEntry] = useState('');
  const [suggestions, setSuggestions] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleMoodSelect = (mood: MoodOption) => {
    setSelectedMood(mood);
    setStep('writing');
  };

  const handleSubmitEntry = async () => {
    if (!journalEntry.trim() || !selectedMood) return;

    setIsProcessing(true);
    try {
      const prompt = `The user is feeling ${selectedMood.label.toLowerCase()} and has written this journal entry: "${journalEntry}"

Please provide 1-2 practical, actionable suggestions to help them based on their current mood and what they've shared. Keep suggestions:
- Specific and actionable
- Supportive and understanding
- Relevant to their emotional state
- Brief but meaningful
- Focused on mental wellbeing and placement stress if applicable

Format your response with simple HTML formatting for readability.`;

      const response = await chatWithGemini(prompt);
      setSuggestions(response);
      setStep('suggestions');
    } catch (error) {
      console.error('Error processing journal entry:', error);
      setSuggestions('<p><b>I\'m having trouble connecting right now.</b></p><p>Here are some general suggestions:</p><ul><li>Take a few deep breaths and give yourself credit for taking time to journal</li><li>Consider talking to a friend, family member, or counselor about your feelings</li></ul>');
      setStep('suggestions');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetJournal = () => {
    setStep('mood');
    setSelectedMood(null);
    setJournalEntry('');
    setSuggestions('');
  };

  return (
    <div className="flex flex-col bg-gray-900 rounded-lg shadow-lg overflow-hidden h-full">
      <div className="p-3 bg-gray-800 text-white">
        <h2 className="text-lg font-medium">Journal Prompt</h2>
        <p className="text-sm text-gray-400">
          {step === 'mood' && 'How are you feeling today?'}
          {step === 'writing' && `Writing about feeling ${selectedMood?.label.toLowerCase()}`}
          {step === 'suggestions' && 'Personalized suggestions for you'}
        </p>
      </div>

      <div className="flex-1 p-3 sm:p-6 overflow-y-auto">
        {step === 'mood' && (
          <div>
            <h3 className="text-xl font-semibold mb-4 text-white text-center">
              How are you feeling right now?
            </h3>
            <p className="text-gray-300 text-center mb-6 text-sm sm:text-base">
              Choose the mood that best describes how you&apos;re feeling today.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {moodOptions.map((mood) => (
                <button
                  key={mood.id}
                  onClick={() => handleMoodSelect(mood)}
                  className="flex flex-col items-center p-3 sm:p-4 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors text-white"
                >
                  <div className={`w-12 h-12 sm:w-16 sm:h-16 ${mood.color} rounded-full flex items-center justify-center text-2xl sm:text-3xl mb-2`}>
                    {mood.emoji}
                  </div>
                  <span className="text-xs sm:text-sm font-medium">{mood.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'writing' && selectedMood && (
          <div>
            <div className="flex items-center justify-center mb-4">
              <div className={`w-16 h-16 ${selectedMood.color} rounded-full flex items-center justify-center text-3xl mr-3`}>
                {selectedMood.emoji}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">Feeling {selectedMood.label}</h3>
                <p className="text-gray-400 text-sm">Let&apos;s explore this together</p>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-4 mb-4">
              <p className="text-gray-300 text-sm sm:text-base italic">
                &ldquo;{selectedMood.prompt}&rdquo;
              </p>
            </div>

            <textarea
              value={journalEntry}
              onChange={(e) => setJournalEntry(e.target.value)}
              placeholder="Start writing about your feelings... There&apos;s no right or wrong way to express yourself."
              className="w-full h-64 sm:h-80 p-4 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-indigo-500 focus:outline-none resize-none text-sm sm:text-base"
              maxLength={2000}
            />

            <div className="flex justify-between items-center mt-4">
              <span className="text-gray-400 text-xs sm:text-sm">
                {journalEntry.length}/2000 characters
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setStep('mood')}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmitEntry}
                  disabled={!journalEntry.trim() || isProcessing}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg text-sm transition-colors"
                >
                  {isProcessing ? 'Processing...' : 'Done writing'} 
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 'suggestions' && selectedMood && (
          <div>
            <div className="flex items-center justify-center mb-6">
              <div className={`w-12 h-12 ${selectedMood.color} rounded-full flex items-center justify-center text-2xl mr-3`}>
                {selectedMood.emoji}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">Suggestions for You</h3>
                <p className="text-gray-400 text-sm">Based on your journal entry</p>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-4 mb-6">
              <div 
                className="text-gray-200 text-sm sm:text-base"
                dangerouslySetInnerHTML={{ __html: suggestions }}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={resetJournal}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm transition-colors"
              >
                New Journal Entry
              </button>
              <button
                onClick={onBack}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors"
              >
                Back to Tools
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

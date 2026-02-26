'use client';

import { useState } from 'react';
import { chatWithGemini } from '../../services/geminiService';
import { sanitizeHtml } from '../../utils/security';

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
  { id: 'happy', label: 'Happy', emoji: '😊', color: '#22c55e', prompt: 'What made you feel happy today? Write about the moments, people, or experiences that brought joy to your life.' },
  { id: 'sad', label: 'Sad', emoji: '😢', color: '#3b82f6', prompt: "It's okay to feel sad. Write about what's weighing on your heart. Sometimes putting feelings into words can help lighten the load." },
  { id: 'anxious', label: 'Anxious', emoji: '😰', color: '#f97316', prompt: "What thoughts are making you feel anxious? Write about your worries and fears. Getting them out of your head and onto paper can bring clarity." },
  { id: 'stressed', label: 'Stressed', emoji: '😤', color: '#ef4444', prompt: "What's causing you stress right now? Write about the pressures you're facing and how they're affecting you. Let it all out." },
  { id: 'confused', label: 'Confused', emoji: '🤔', color: '#a855f7', prompt: "What's unclear or confusing in your life right now? Write about the decisions you're facing or situations you're trying to understand." },
  { id: 'angry', label: 'Angry', emoji: '😠', color: '#dc2626', prompt: "What's making you angry? Write about what triggered these feelings and how it's affecting you. Express yourself freely." },
  { id: 'excited', label: 'Excited', emoji: '🤩', color: '#ec4899', prompt: "What's got you excited? Write about what you're looking forward to or what's energizing you right now." },
  { id: 'calm', label: 'Calm', emoji: '😌', color: '#10a37f', prompt: "Enjoy this peaceful moment. Write about what's bringing you calm or reflect on your current state of mind." }
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
    <div className="flex flex-col rounded-xl overflow-hidden h-full" style={{ background: 'var(--bg-secondary)' }}>
      <div className="p-3 border-b" style={{ background: 'var(--bg-tertiary)', borderColor: 'var(--border-primary)' }}>
        <h2 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>Journal Prompt</h2>
        <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
          {step === 'mood' && 'How are you feeling today?'}
          {step === 'writing' && `Writing about feeling ${selectedMood?.label.toLowerCase()}`}
          {step === 'suggestions' && 'Personalized suggestions for you'}
        </p>
      </div>

      <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
        {step === 'mood' && (
          <div>
            <h3 className="text-lg font-semibold mb-4 text-center" style={{ color: 'var(--text-primary)' }}>
              How are you feeling right now?
            </h3>
            <p className="text-center mb-6 text-sm" style={{ color: 'var(--text-secondary)' }}>
              Choose the mood that best describes how you&apos;re feeling today.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {moodOptions.map((mood) => (
                <button
                  key={mood.id}
                  onClick={() => handleMoodSelect(mood)}
                  className="flex flex-col items-center p-3 sm:p-4 rounded-xl transition-all"
                  style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-primary)', color: 'var(--text-primary)' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = mood.color}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-primary)'}
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center text-2xl sm:text-3xl mb-2" style={{ background: `${mood.color}15` }}>
                    {mood.emoji}
                  </div>
                  <span className="text-xs sm:text-sm font-medium">{mood.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'writing' && selectedMood && (
          <div className="animate-fade-in">
            <div className="flex items-center justify-center mb-4 gap-3">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl" style={{ background: `${selectedMood.color}15` }}>
                {selectedMood.emoji}
              </div>
              <div>
                <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Feeling {selectedMood.label}</h3>
                <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Let&apos;s explore this together</p>
              </div>
            </div>

            <div className="rounded-xl p-4 mb-4" style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-primary)' }}>
              <p className="text-sm italic" style={{ color: 'var(--text-secondary)' }}>
                &ldquo;{selectedMood.prompt}&rdquo;
              </p>
            </div>

            <textarea
              value={journalEntry}
              onChange={(e) => setJournalEntry(e.target.value)}
              placeholder="Start writing about your feelings..."
              className="w-full h-48 sm:h-64 p-4 rounded-xl border focus:outline-none resize-none text-sm"
              style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)', borderColor: 'var(--border-primary)' }}
              maxLength={2000}
            />

            <div className="flex justify-between items-center mt-3">
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {journalEntry.length}/2000
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setStep('mood')}
                  className="px-4 py-2 rounded-lg text-sm transition-all"
                  style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)', border: '1px solid var(--border-primary)' }}
                >
                  Back
                </button>
                <button
                  onClick={handleSubmitEntry}
                  disabled={!journalEntry.trim() || isProcessing}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-all disabled:opacity-50"
                  style={{ background: 'var(--accent-primary)' }}
                >
                  {isProcessing ? 'Processing...' : 'Done writing'}
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 'suggestions' && selectedMood && (
          <div className="animate-fade-in">
            <div className="flex items-center justify-center mb-6 gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: `${selectedMood.color}15` }}>
                {selectedMood.emoji}
              </div>
              <div>
                <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Suggestions for You</h3>
                <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Based on your journal entry</p>
              </div>
            </div>

            <div className="rounded-xl p-4 mb-6" style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-primary)' }}>
              <div
                className="text-sm chat-message"
                style={{ color: 'var(--text-secondary)' }}
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(suggestions) }}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <button
                onClick={resetJournal}
                className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-all"
                style={{ background: 'var(--accent-primary)' }}
              >
                New Journal Entry
              </button>
              <button
                onClick={onBack}
                className="px-4 py-2 rounded-lg text-sm transition-all"
                style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)', border: '1px solid var(--border-primary)' }}
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

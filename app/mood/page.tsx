'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useUser } from '@clerk/nextjs';
import { ChatProvider } from '../context/ChatContext';

interface MoodEntry {
  date: string;
  mood: number;
  moodLabel: string;
  note: string;
  color: string;
  emoji: string;
}

interface Quote {
  quote: string;
  author: string;
}

const moodOptions = [
  { value: 1, label: 'Terrible', emoji: '😭', color: '#ef4444' },
  { value: 2, label: 'Bad', emoji: '😔', color: '#f97316' },
  { value: 3, label: 'Okay', emoji: '😐', color: '#eab308' },
  { value: 4, label: 'Good', emoji: '😊', color: '#22c55e' },
  { value: 5, label: 'Excellent', emoji: '🤩', color: '#10a37f' }
];

const motivationalQuotes: Quote[] = [
  { quote: "Every day is a new beginning. Take a deep breath, smile, and start again.", author: "Unknown" },
  { quote: "Your current situation is not your final destination. The best is yet to come.", author: "Unknown" },
  { quote: "Difficult roads often lead to beautiful destinations.", author: "Zig Ziglar" },
  { quote: "You are stronger than you think and more capable than you imagine.", author: "Unknown" },
  { quote: "Progress, not perfection. Every small step counts.", author: "Unknown" }
];

function MoodContent() {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [note, setNote] = useState('');
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [currentQuote, setCurrentQuote] = useState<Quote>(motivationalQuotes[0]);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
    setCurrentQuote(randomQuote);
  }, []);

  const saveMoodEntry = () => {
    if (selectedMood === null) return;

    const moodOption = moodOptions.find(m => m.value === selectedMood);
    if (!moodOption) return;

    const newEntry: MoodEntry = {
      date: new Date().toISOString().split('T')[0],
      mood: selectedMood,
      moodLabel: moodOption.label,
      note: note.trim(),
      color: moodOption.color,
      emoji: moodOption.emoji
    };

    const updatedHistory = [newEntry, ...moodHistory.slice(0, 6)];
    setMoodHistory(updatedHistory);

    setSelectedMood(null);
    setNote('');
    setShowSuccess(true);

    setTimeout(() => setShowSuccess(false), 3000);

    const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
    setCurrentQuote(randomQuote);
  };

  const getMoodTrend = () => {
    if (moodHistory.length < 2) return null;

    const recent = moodHistory.slice(0, 3);
    const average = recent.reduce((sum, entry) => sum + entry.mood, 0) / recent.length;

    if (average >= 4) return { message: "You're doing great! Keep it up 🎉", color: 'var(--accent-primary)' };
    if (average >= 3) return { message: 'Things are looking up! 💪', color: 'var(--yellow-accent)' };
    return { message: 'Take care of yourself 💛', color: '#f97316' };
  };

  const trend = getMoodTrend();

  return (
    <div className="min-h-screen w-full flex flex-col" style={{ background: 'var(--bg-primary)' }}>
      {/* Header */}
      <div className="w-full p-4 sm:p-6 border-b z-10 sticky top-0" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-primary)' }}>
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Mood Tracker</h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>Track your daily emotional wellbeing</p>
          </div>

        </div>
      </div>

      <div className="flex-1 w-full p-4 sm:p-6 overflow-y-auto">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Success toast */}
          {showSuccess && (
            <div className="p-4 rounded-xl text-center text-sm animate-fade-in" style={{ background: 'var(--accent-surface)', border: '1px solid var(--accent-border)', color: 'var(--accent-primary)' }}>
              🎉 Mood logged successfully!
            </div>
          )}

          {/* Daily Inspiration */}
          <div className="rounded-2xl p-6 sm:p-8" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)' }}>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">💫</span>
              <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Daily Inspiration</h2>
            </div>
            <blockquote className="text-base italic leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>
              &ldquo;{currentQuote.quote}&rdquo;
            </blockquote>
            <p className="text-sm text-right" style={{ color: 'var(--text-tertiary)' }}>— {currentQuote.author}</p>
          </div>

          {/* Mood selector */}
          <div className="rounded-2xl p-6 sm:p-8" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)' }}>
            <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>How are you feeling today?</h2>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {moodOptions.map((mood) => (
                <button
                  key={mood.value}
                  onClick={() => setSelectedMood(mood.value)}
                  className="p-4 sm:p-5 rounded-xl transition-all transform hover:scale-[1.02]"
                  style={{
                    background: selectedMood === mood.value ? `${mood.color}20` : 'var(--bg-tertiary)',
                    border: `2px solid ${selectedMood === mood.value ? mood.color : 'transparent'}`,
                    color: selectedMood === mood.value ? mood.color : 'var(--text-secondary)',
                  }}
                >
                  <div className="text-3xl sm:text-4xl mb-2">{mood.emoji}</div>
                  <div className="text-sm font-medium">{mood.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Note input */}
          {selectedMood && (
            <div className="rounded-2xl p-6 sm:p-8 animate-fade-in" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)' }}>
              <label className="block text-base font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                Add a note (optional)
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="What's on your mind?"
                className="w-full p-4 rounded-xl border-0 focus:ring-2 focus:outline-none resize-none text-sm transition-all shadow-inner focus:ring-[var(--accent-primary)]"
                style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}
                rows={4}
                maxLength={200}
              />
              <div className="flex justify-between items-center mt-3">
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{note.length}/200</span>
                <button
                  onClick={saveMoodEntry}
                  className="px-6 py-2.5 rounded-xl font-medium text-sm text-white transition-all"
                  style={{ background: 'var(--accent-primary)' }}
                >
                  Log My Mood
                </button>
              </div>
            </div>
          )}

          {/* Trend */}
          {trend && (
            <div className="rounded-2xl p-6 sm:p-8" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)' }}>
              <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--text-tertiary)' }}>Your Recent Trend</h3>
              <p className="text-base font-medium" style={{ color: trend.color }}>{trend.message}</p>
            </div>
          )}

          {/* History */}
          {moodHistory.length > 0 && (
            <div className="rounded-2xl p-6 sm:p-8" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)' }}>
              <h3 className="text-base font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Recent Entries</h3>
              <div className="space-y-3">
                {moodHistory.slice(0, 5).map((entry, index) => (
                  <div key={index} className="rounded-xl p-4 shadow-sm" style={{ background: 'var(--bg-tertiary)' }}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{entry.emoji}</span>
                        <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>{entry.moodLabel}</span>
                      </div>
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{new Date(entry.date).toLocaleDateString()}</span>
                    </div>
                    {entry.note && (
                      <p className="text-sm italic pl-9" style={{ color: 'var(--text-secondary)' }}>&ldquo;{entry.note}&rdquo;</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MoodTracker() {
  const { isSignedIn, isLoaded } = useUser();
  if (!isLoaded) return null;

  return (
    <ChatProvider>
      <DashboardLayout isGuestMode={!isSignedIn}>
        <div className="h-full flex-1 overflow-y-auto">
          <MoodContent />
        </div>
      </DashboardLayout>
    </ChatProvider>
  );
}
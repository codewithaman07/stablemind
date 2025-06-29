'use client';

import { useState, useEffect } from 'react';

interface MoodTrackerProps {
  onBack: () => void;
}

interface MoodEntry {
  date: string;
  mood: number; // 1-5 scale
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
  { value: 1, label: 'Terrible', emoji: '😭', color: 'bg-red-500' },
  { value: 2, label: 'Bad', emoji: '😔', color: 'bg-orange-500' },
  { value: 3, label: 'Okay', emoji: '😐', color: 'bg-yellow-500' },
  { value: 4, label: 'Good', emoji: '😊', color: 'bg-green-500' },
  { value: 5, label: 'Excellent', emoji: '🤩', color: 'bg-emerald-500' }
];

const motivationalQuotes: Quote[] = [
  {
    quote: "Every day is a new beginning. Take a deep breath, smile, and start again.",
    author: "Unknown"
  },
  {
    quote: "Your current situation is not your final destination. The best is yet to come.",
    author: "Unknown"
  },
  {
    quote: "Difficult roads often lead to beautiful destinations.",
    author: "Zig Ziglar"
  },
  {
    quote: "You are stronger than you think and more capable than you imagine.",
    author: "Unknown"
  },
  {
    quote: "Progress, not perfection. Every small step counts.",
    author: "Unknown"
  }
];

export default function MoodTracker({ onBack }: MoodTrackerProps) {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [note, setNote] = useState('');
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [currentQuote, setCurrentQuote] = useState<Quote>(motivationalQuotes[0]);
  const [showSuccess, setShowSuccess] = useState(false);

  // Load mood history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('moodHistory');
    if (saved) {
      setMoodHistory(JSON.parse(saved));
    }
    
    // Set random motivational quote
    const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
    setCurrentQuote(randomQuote);
  }, []);

  const saveMoodEntry = () => {
    if (selectedMood === null) return;

    const moodOption = moodOptions.find(m => m.value === selectedMood);
    if (!moodOption) return;

    const newEntry: MoodEntry = {
      date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
      mood: selectedMood,
      moodLabel: moodOption.label,
      note: note.trim(),
      color: moodOption.color,
      emoji: moodOption.emoji
    };

    const updatedHistory = [newEntry, ...moodHistory.slice(0, 6)]; // Keep last 7 entries
    setMoodHistory(updatedHistory);
    localStorage.setItem('moodHistory', JSON.stringify(updatedHistory));

    // Reset form
    setSelectedMood(null);
    setNote('');
    setShowSuccess(true);
    
    // Hide success message after 3 seconds
    setTimeout(() => setShowSuccess(false), 3000);

    // Get new motivational quote
    const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
    setCurrentQuote(randomQuote);
  };

  const getMoodTrend = () => {
    if (moodHistory.length < 2) return null;
    
    const recent = moodHistory.slice(0, 3);
    const average = recent.reduce((sum, entry) => sum + entry.mood, 0) / recent.length;
    
    if (average >= 4) return { trend: 'great', message: 'You\'re doing great!', color: 'text-green-400' };
    if (average >= 3) return { trend: 'good', message: 'Things are looking up!', color: 'text-yellow-400' };
    return { trend: 'needs-attention', message: 'Take care of yourself', color: 'text-orange-400' };
  };

  const trend = getMoodTrend();

  return (
    <div className="flex flex-col bg-gray-900 rounded-lg shadow-lg overflow-hidden h-full">
      <div className="p-3 bg-gray-800 text-white">
        <h2 className="text-lg font-medium">Mood Tracker</h2>
        <p className="text-sm text-gray-400">Track your daily emotional wellbeing</p>
      </div>

      <div className="flex-1 p-3 overflow-y-auto">
        {/* Success Message */}
        {showSuccess && (
          <div className="bg-green-900 border border-green-700 text-green-300 p-2 rounded-lg mb-3 text-sm">
            Mood logged successfully! 🎉
          </div>
        )}

        {/* Motivational Quote */}
        <div className="bg-indigo-900 rounded-lg p-3 mb-4 border border-indigo-700">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">💫</span>
            <h3 className="text-sm font-semibold text-white">Inspiration</h3>
          </div>
          <blockquote className="text-sm text-indigo-200 italic mb-1 leading-relaxed">
            "{currentQuote.quote}"
          </blockquote>
          <p className="text-indigo-300 text-xs text-right">— {currentQuote.author}</p>
        </div>

        {/* Mood Selection */}
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-white mb-2">How are you feeling today?</h3>
          <div className="grid grid-cols-5 gap-1">
            {moodOptions.map((mood) => (
              <button
                key={mood.value}
                onClick={() => setSelectedMood(mood.value)}
                className={`p-2 rounded-lg transition-all ${
                  selectedMood === mood.value
                    ? `${mood.color} text-white scale-105`
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <div className="text-lg mb-1">{mood.emoji}</div>
                <div className="text-xs font-medium">{mood.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Note Input */}
        {selectedMood && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-white mb-1">
              Add a note (optional)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="What's on your mind?"
              className="w-full p-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-indigo-500 focus:outline-none resize-none text-sm"
              rows={2}
              maxLength={200}
            />
            <div className="text-xs text-gray-400 mt-1">{note.length}/200</div>
          </div>
        )}

        {/* Save Button */}
        {selectedMood && (
          <button
            onClick={saveMoodEntry}
            className="w-full px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm transition-colors mb-4"
          >
            Log Mood
          </button>
        )}

        {/* Mood Trend */}
        {trend && (
          <div className="bg-gray-800 rounded-lg p-3 mb-4">
            <h4 className="text-sm font-semibold text-white mb-1">Recent Trend</h4>
            <p className={`text-sm ${trend.color}`}>{trend.message}</p>
          </div>
        )}

        {/* Mood History */}
        {moodHistory.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-white mb-2">Recent Entries</h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {moodHistory.slice(0, 3).map((entry, index) => (
                <div key={index} className="bg-gray-800 rounded-md p-2 border border-gray-700">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{entry.emoji}</span>
                      <span className="text-sm text-white">{entry.moodLabel}</span>
                    </div>
                    <span className="text-xs text-gray-400">{entry.date}</span>
                  </div>
                  {entry.note && (
                    <p className="text-xs text-gray-300 italic">"{entry.note}"</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={onBack}
          className="w-full px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors"
        >
          Back to Tools
        </button>
      </div>
    </div>
  );
}

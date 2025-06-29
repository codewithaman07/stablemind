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

  useEffect(() => {
    const saved = localStorage.getItem('moodHistory');
    if (saved) {
      setMoodHistory(JSON.parse(saved));
    }
    
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
    localStorage.setItem('moodHistory', JSON.stringify(updatedHistory));

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
    
    if (average >= 4) return { trend: 'great', message: 'You\'re doing great!', color: 'text-green-400' };
    if (average >= 3) return { trend: 'good', message: 'Things are looking up!', color: 'text-yellow-400' };
    return { trend: 'needs-attention', message: 'Take care of yourself', color: 'text-orange-400' };
  };

  const trend = getMoodTrend();

  return (
    <div className="min-h-screen w-full bg-gray-900 flex flex-col">
      <div className="w-full p-4 sm:p-6 bg-gray-800 text-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Mood Tracker</h1>
          <p className="text-gray-400">Track your daily emotional wellbeing and stay motivated</p>
        </div>
      </div>

      <div className="flex-1 w-full p-4 sm:p-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-6">
          {showSuccess && (
            <div className="bg-green-900 border border-green-700 text-green-300 p-4 rounded-lg text-center">
              <span className="text-2xl mr-2">🎉</span>
              Mood logged successfully!
            </div>
          )}

          <div className="bg-gradient-to-r from-indigo-900 to-purple-900 rounded-xl p-6 border border-indigo-700">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">💫</span>
              <h2 className="text-xl font-semibold text-white">Daily Inspiration</h2>
            </div>
            <blockquote className="text-lg text-indigo-200 italic mb-3 leading-relaxed">
              &ldquo;{currentQuote.quote}&rdquo;
            </blockquote>
            <p className="text-indigo-300 text-right">— {currentQuote.author}</p>
          </div>

          <div className="bg-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">How are you feeling today?</h2>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              {moodOptions.map((mood) => (
                <button
                  key={mood.value}
                  onClick={() => setSelectedMood(mood.value)}
                  className={`p-4 sm:p-6 rounded-xl transition-all transform hover:scale-105 ${
                    selectedMood === mood.value
                      ? `${mood.color} text-white scale-105 shadow-lg`
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <div className="text-3xl sm:text-4xl mb-2">{mood.emoji}</div>
                  <div className="text-sm sm:text-base font-medium">{mood.label}</div>
                </button>
              ))}
            </div>
          </div>

          {selectedMood && (
            <div className="bg-gray-800 rounded-xl p-6">
              <label className="block text-lg font-semibold text-white mb-3">
                Add a note (optional)
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="What's on your mind? Share your thoughts..."
                className="w-full p-4 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-indigo-500 focus:outline-none resize-none text-base"
                rows={4}
                maxLength={200}
              />
              <div className="flex justify-between items-center mt-3">
                <div className="text-sm text-gray-400">{note.length}/200 characters</div>
                <button
                  onClick={saveMoodEntry}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
                >
                  Log My Mood
                </button>
              </div>
            </div>
          )}

          {trend && (
            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-2">Your Recent Trend</h3>
              <p className={`text-lg ${trend.color} font-medium`}>{trend.message}</p>
            </div>
          )}

          {moodHistory.length > 0 && (
            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Recent Entries</h3>
              <div className="grid gap-4">
                {moodHistory.slice(0, 5).map((entry, index) => (
                  <div key={index} className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{entry.emoji}</span>
                        <span className="text-white font-medium">{entry.moodLabel}</span>
                      </div>
                      <span className="text-gray-400 text-sm">{new Date(entry.date).toLocaleDateString()}</span>
                    </div>
                    {entry.note && (
                      <p className="text-gray-300 italic pl-9">&ldquo;{entry.note}&rdquo;</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="text-center pt-4">
            <button
              onClick={onBack}
              className="px-8 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
            >
              ← Back to Tools
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
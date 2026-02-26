'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useUser, useAuth } from '@clerk/nextjs';
import { ChatProvider } from '../context/ChatContext';
import { saveMoodEntry as saveMoodToDB, getMoodEntries, MoodEntryDB } from '../lib/database';

interface MoodEntry {
  date: string;
  mood: number;
  moodLabel: string;
  note: string;
  color: string;
  emoji: string;
}

const moodOptions = [
  { value: 1, label: 'Terrible', emoji: '😭', color: '#ef4444' },
  { value: 2, label: 'Bad', emoji: '😔', color: '#f97316' },
  { value: 3, label: 'Okay', emoji: '😐', color: '#eab308' },
  { value: 4, label: 'Good', emoji: '😊', color: '#22c55e' },
  { value: 5, label: 'Excellent', emoji: '🤩', color: '#10a37f' }
];

function MoodContent() {
  const { user } = useUser();
  const { getToken } = useAuth();
  const userId = user?.id || 'guest';
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [note, setNote] = useState('');
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  // Load mood history from Supabase
  useEffect(() => {
    if (userId === 'guest') {
      setIsLoadingHistory(false);
      return;
    }

    async function loadHistory() {
      try {
        const token = await getToken({ template: 'supabase' }) || undefined;
        const entries = await getMoodEntries(userId, 10, token);
        setMoodHistory(entries.map((e: MoodEntryDB) => ({
          date: e.created_at || new Date().toISOString(),
          mood: e.mood,
          moodLabel: e.mood_label,
          note: e.note,
          color: e.color,
          emoji: e.emoji,
        })));
      } catch (err) {
        console.error('Failed to load mood history:', err);
      } finally {
        setIsLoadingHistory(false);
      }
    }

    loadHistory();
  }, [userId, getToken]);

  const saveMoodEntry = async () => {
    if (selectedMood === null) return;

    const moodOption = moodOptions.find(m => m.value === selectedMood);
    if (!moodOption) return;

    setIsSaving(true);

    const newEntry: MoodEntry = {
      date: new Date().toISOString(),
      mood: selectedMood,
      moodLabel: moodOption.label,
      note: note.trim(),
      color: moodOption.color,
      emoji: moodOption.emoji
    };

    // Optimistically update UI
    setMoodHistory(prev => [newEntry, ...prev.slice(0, 9)]);
    setSelectedMood(null);
    setNote('');
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);

    // Persist to Supabase
    if (userId !== 'guest') {
      try {
        const token = await getToken({ template: 'supabase' }) || undefined;
        await saveMoodToDB({
          user_id: userId,
          mood: newEntry.mood,
          mood_label: newEntry.moodLabel,
          note: newEntry.note,
          emoji: newEntry.emoji,
          color: newEntry.color,
        }, token);
      } catch (err) {
        console.error('Failed to save mood entry:', err);
      }
    }

    setIsSaving(false);
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
    <div className="h-full w-full flex flex-col" style={{ background: 'var(--bg-primary)' }}>
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
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl font-medium text-sm text-white transition-all disabled:opacity-50"
                  style={{ background: 'var(--accent-primary)' }}
                >
                  {isSaving ? 'Saving...' : 'Log My Mood'}
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
          {isLoadingHistory ? (
            <div className="rounded-2xl p-6 sm:p-8 text-center" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)' }}>
              <div className="w-6 h-6 rounded-full mx-auto mb-3 animate-spin" style={{ border: '2px solid var(--border-primary)', borderTopColor: 'var(--accent-primary)' }} />
              <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Loading your mood history...</p>
            </div>
          ) : moodHistory.length > 0 && (
            <div className="rounded-2xl p-6 sm:p-8" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)' }}>
              <h3 className="text-base font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Recent Entries</h3>
              <div className="space-y-3">
                {moodHistory.slice(0, 7).map((entry, index) => (
                  <div key={index} className="rounded-xl p-4 shadow-sm animate-fade-in" style={{ background: 'var(--bg-tertiary)', animationDelay: `${index * 0.05}s`, animationFillMode: 'backwards' }}>
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

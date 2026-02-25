'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { ChatProvider } from '../context/ChatContext';
import { useUser } from '@clerk/nextjs';
import {
  saveQuote as saveQuoteToDB,
  getSavedQuotes as getSavedQuotesFromDB,
  deleteSavedQuote as deleteQuoteFromDB,
  updateUserStats,
  incrementQuotesDiscovered,
} from '../lib/database';

interface Quote {
  q: string;
  a: string;
}

interface SavedQuote extends Quote {
  savedAt: number;
}

// ─── Particle Effect Component ───────────────────────────────────────────────
function SparkleEffect({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!active || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const particles: {
      x: number; y: number; vx: number; vy: number;
      size: number; opacity: number; color: string; life: number;
    }[] = [];

    const colors = ['#10a37f', '#34d399', '#6ee7b7', '#a7f3d0', '#fbbf24', '#f59e0b'];

    for (let i = 0; i < 40; i++) {
      particles.push({
        x: canvas.width / 2 + (Math.random() - 0.5) * 100,
        y: canvas.height / 2,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8 - 2,
        size: Math.random() * 4 + 2,
        opacity: 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 1,
      });
    }

    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.1;
        p.life -= 0.02;
        p.opacity = Math.max(0, p.life);
        p.size *= 0.99;

        if (p.life > 0) {
          alive = true;
          ctx.save();
          ctx.globalAlpha = p.opacity;
          ctx.fillStyle = p.color;
          ctx.beginPath();

          // Draw star shape
          const s = p.size;
          for (let j = 0; j < 5; j++) {
            const angle = (j * 4 * Math.PI) / 5 - Math.PI / 2;
            const method = j === 0 ? 'moveTo' : 'lineTo';
            ctx[method](
              p.x + Math.cos(angle) * s,
              p.y + Math.sin(angle) * s
            );
          }
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        }
      });

      if (alive) {
        animationId = requestAnimationFrame(animate);
      }
    };

    animate();
    return () => cancelAnimationFrame(animationId);
  }, [active]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-50"
      style={{ width: '100%', height: '100%' }}
    />
  );
}

// ─── Time-based greeting ─────────────────────────────────────────────────────
function getGreeting(): { text: string; emoji: string } {
  const hour = new Date().getHours();
  if (hour < 12) return { text: 'Good Morning', emoji: '🌅' };
  if (hour < 17) return { text: 'Good Afternoon', emoji: '☀️' };
  if (hour < 21) return { text: 'Good Evening', emoji: '🌇' };
  return { text: 'Good Night', emoji: '🌙' };
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function AffirmationsPage() {
  const { user } = useUser();
  const userId = user?.id || null;
  const [dailyQuote, setDailyQuote] = useState<Quote | null>(null);
  const [quoteDeck, setQuoteDeck] = useState<Quote[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [savedQuotes, setSavedQuotes] = useState<SavedQuote[]>([]);
  const [streak, setStreak] = useState(0);
  const [totalDiscovered, setTotalDiscovered] = useState(0);
  const [showSparkle, setShowSparkle] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showSaved, setShowSaved] = useState(false);
  const [isLoadingDaily, setIsLoadingDaily] = useState(true);
  const [isLoadingDeck, setIsLoadingDeck] = useState(true);
  const [justSaved, setJustSaved] = useState(false);

  const greeting = getGreeting();

  // Initialize state from Supabase
  useEffect(() => {
    async function init() {
      if (userId) {
        try {
          // Update streak in DB
          const stats = await updateUserStats(userId);
          setStreak(stats.streak);
          setTotalDiscovered(stats.quotes_discovered);

          // Load saved quotes from DB
          const quotes = await getSavedQuotesFromDB(userId);
          setSavedQuotes(quotes.map(q => ({ q: q.quote, a: q.author, savedAt: new Date(q.saved_at || '').getTime() })));
        } catch (err) {
          console.error('Failed to load user data:', err);
        }
      }
      fetchDailyQuote();
      fetchQuoteDeck();
    }
    init();
  }, [userId]);

  const fetchDailyQuote = async () => {
    setIsLoadingDaily(true);
    try {
      const res = await fetch('/api/quote?mode=today');
      if (res.ok) {
        const data = await res.json();
        if (data.q) {
          setDailyQuote(data);
          setIsLoadingDaily(false);
          return;
        }
      }
    } catch (e) {
      console.error('Failed to fetch daily quote:', e);
    }
    setDailyQuote({ q: "Every day is a new beginning. Take a deep breath, smile, and start again.", a: "Unknown" });
    setIsLoadingDaily(false);
  };

  const fetchQuoteDeck = async () => {
    setIsLoadingDeck(true);
    try {
      const res = await fetch('/api/quote?mode=quotes');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          // Shuffle the deck
          const shuffled = [...data].sort(() => Math.random() - 0.5);
          setQuoteDeck(shuffled);
          setCurrentCardIndex(0);
          if (userId) { incrementQuotesDiscovered(userId, 1).then(n => setTotalDiscovered(n)).catch(() => { }); }
          setIsLoadingDeck(false);
          return;
        }
      }
    } catch (e) {
      console.error('Failed to fetch quote deck:', e);
    }
    setIsLoadingDeck(false);
  };

  const currentCard = quoteDeck[currentCardIndex] || null;

  const drawNextCard = useCallback(() => {
    if (quoteDeck.length === 0) return;

    setIsFlipping(true);
    setShowSparkle(true);

    setTimeout(() => {
      const nextIndex = (currentCardIndex + 1) % quoteDeck.length;
      setCurrentCardIndex(nextIndex);
      if (userId) { incrementQuotesDiscovered(userId).then(n => setTotalDiscovered(n)).catch(() => { }); }

      // If we've cycled through all, fetch new deck
      if (nextIndex === 0) {
        fetchQuoteDeck();
      }
    }, 300);

    setTimeout(() => setIsFlipping(false), 600);
    setTimeout(() => setShowSparkle(false), 1200);
  }, [currentCardIndex, quoteDeck.length]);

  const saveQuote = async (quote: Quote) => {
    const exists = savedQuotes.some(q => q.q === quote.q);
    if (exists) return;

    const newSaved: SavedQuote[] = [{ ...quote, savedAt: Date.now() }, ...savedQuotes];
    setSavedQuotes(newSaved);
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 1500);

    if (userId) {
      try { await saveQuoteToDB(userId, quote.q, quote.a); } catch (err) { console.error('Failed to save quote:', err); }
    }
  };

  const removeSavedQuote = async (quoteText: string) => {
    setSavedQuotes(prev => prev.filter(q => q.q !== quoteText));

    if (userId) {
      try { await deleteQuoteFromDB(userId, quoteText); } catch (err) { console.error('Failed to delete quote:', err); }
    }
  };

  const isQuoteSaved = (quote: Quote) => savedQuotes.some(q => q.q === quote.q);

  const copyQuote = (quote: Quote, id: string) => {
    navigator.clipboard.writeText(`"${quote.q}" — ${quote.a}`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Streak milestones
  const getStreakBadge = (s: number): { icon: string; label: string } => {
    if (s >= 30) return { icon: '👑', label: 'Legend' };
    if (s >= 14) return { icon: '🔥', label: 'On Fire' };
    if (s >= 7) return { icon: '⚡', label: 'Committed' };
    if (s >= 3) return { icon: '🌱', label: 'Growing' };
    return { icon: '✨', label: 'Starter' };
  };

  const streakBadge = getStreakBadge(streak);

  return (
    <ChatProvider>
      <DashboardLayout>
        <div className="max-w-4xl mx-auto p-4 sm:p-6 pb-12">

          {/* ── Hero Header ────────────────────────────────────────── */}
          <div className="mb-8 animate-fade-in">
            <div className="flex items-center gap-3 mb-1">
              <span className="text-2xl">{greeting.emoji}</span>
              <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {greeting.text}
              </h1>
            </div>
            <p className="text-sm ml-11" style={{ color: 'var(--text-tertiary)' }}>
              Take a moment to find your inspiration today
            </p>
          </div>

          {/* ── Stats Bar ──────────────────────────────────────────── */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            {/* Streak */}
            <div
              className="relative overflow-hidden rounded-xl p-4 text-center transition-all animate-fade-in"
              style={{
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-primary)',
                animationDelay: '0.1s',
                animationFillMode: 'backwards'
              }}
            >
              <div className="text-2xl mb-1">{streakBadge.icon}</div>
              <div className="text-2xl font-bold" style={{ color: 'var(--accent-primary)' }}>{streak}</div>
              <div className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>
                Day Streak
              </div>
              <div className="text-[10px] mt-1 px-2 py-0.5 rounded-full inline-block" style={{ background: 'var(--accent-surface)', color: 'var(--accent-primary)' }}>
                {streakBadge.label}
              </div>
            </div>

            {/* Discovered */}
            <div
              className="rounded-xl p-4 text-center transition-all animate-fade-in"
              style={{
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-primary)',
                animationDelay: '0.2s',
                animationFillMode: 'backwards'
              }}
            >
              <div className="text-2xl mb-1">🎴</div>
              <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{totalDiscovered}</div>
              <div className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>
                Discovered
              </div>
            </div>

            {/* Saved */}
            <button
              onClick={() => setShowSaved(!showSaved)}
              className="rounded-xl p-4 text-center transition-all animate-fade-in"
              style={{
                background: showSaved ? 'var(--accent-surface)' : 'var(--bg-tertiary)',
                border: `1px solid ${showSaved ? 'var(--accent-primary)' : 'var(--border-primary)'}`,
                animationDelay: '0.3s',
                animationFillMode: 'backwards'
              }}
            >
              <div className="text-2xl mb-1">💜</div>
              <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{savedQuotes.length}</div>
              <div className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>
                Saved
              </div>
            </button>
          </div>

          {/* ── Quote of the Day ───────────────────────────────────── */}
          <div
            className="relative rounded-2xl mb-8 overflow-hidden animate-fade-in"
            style={{
              animationDelay: '0.15s',
              animationFillMode: 'backwards'
            }}
          >
            {/* Animated gradient border */}
            <div className="absolute inset-0 rounded-2xl aff-gradient-border" />
            <div
              className="relative m-[1px] rounded-2xl p-6 sm:p-8"
              style={{ background: 'var(--bg-secondary)' }}
            >
              <div className="flex items-center gap-2 mb-5">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg" style={{ background: 'var(--accent-surface)' }}>
                  ☀️
                </div>
                <div>
                  <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    Quote of the Day
                  </h2>
                  <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Refreshes daily</p>
                </div>
              </div>

              {isLoadingDaily ? (
                <div className="h-24 rounded-xl aff-shimmer" style={{ background: 'var(--bg-tertiary)' }} />
              ) : dailyQuote ? (
                <>
                  <blockquote className="text-lg sm:text-xl font-medium leading-relaxed mb-4" style={{ color: 'var(--text-primary)' }}>
                    &ldquo;{dailyQuote.q}&rdquo;
                  </blockquote>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium" style={{ color: 'var(--accent-primary)' }}>
                      — {dailyQuote.a}
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => copyQuote(dailyQuote, 'daily')}
                        className="p-2 rounded-lg text-xs transition-all"
                        style={{
                          background: copiedId === 'daily' ? 'var(--accent-surface)' : 'var(--bg-tertiary)',
                          color: copiedId === 'daily' ? 'var(--accent-primary)' : 'var(--text-tertiary)',
                          border: '1px solid var(--border-primary)'
                        }}
                        title="Copy quote"
                      >
                        {copiedId === 'daily' ? '✓ Copied' : '📋'}
                      </button>
                      <button
                        onClick={() => saveQuote(dailyQuote)}
                        className="p-2 rounded-lg text-xs transition-all"
                        style={{
                          background: isQuoteSaved(dailyQuote) ? 'var(--accent-surface)' : 'var(--bg-tertiary)',
                          color: isQuoteSaved(dailyQuote) ? 'var(--accent-primary)' : 'var(--text-tertiary)',
                          border: '1px solid var(--border-primary)'
                        }}
                        title={isQuoteSaved(dailyQuote) ? 'Already saved' : 'Save quote'}
                      >
                        {isQuoteSaved(dailyQuote) ? '💜' : '🤍'}
                      </button>
                    </div>
                  </div>
                </>
              ) : null}
            </div>
          </div>

          {/* ── Interactive Card Draw ──────────────────────────────── */}
          <div
            className="mb-8 animate-fade-in"
            style={{ animationDelay: '0.25s', animationFillMode: 'backwards' }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-lg">🎴</span>
                <h2 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Draw a Quote
                </h2>
              </div>
              <span className="text-xs px-2 py-1 rounded-full" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-muted)' }}>
                {quoteDeck.length > 0
                  ? `${currentCardIndex + 1} / ${quoteDeck.length}`
                  : '...'
                }
              </span>
            </div>

            {/* Card Area */}
            <div className="relative" style={{ perspective: '1000px' }}>
              <SparkleEffect active={showSparkle} />

              {isLoadingDeck ? (
                <div
                  className="rounded-2xl p-8 text-center aff-shimmer"
                  style={{
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-primary)',
                    minHeight: '200px'
                  }}
                />
              ) : currentCard ? (
                <div
                  className={`aff-card ${isFlipping ? 'aff-card-flip' : ''}`}
                >
                  <div
                    className="rounded-2xl p-6 sm:p-8 transition-all"
                    style={{
                      background: 'var(--bg-tertiary)',
                      border: '1px solid var(--border-primary)',
                    }}
                  >
                    {/* Quote */}
                    <div className="text-center mb-6">
                      <div className="text-3xl mb-4 aff-float">💫</div>
                      <blockquote className="text-base sm:text-lg font-medium leading-relaxed mb-4" style={{ color: 'var(--text-primary)' }}>
                        &ldquo;{currentCard.q}&rdquo;
                      </blockquote>
                      <p className="text-sm" style={{ color: 'var(--accent-primary)' }}>
                        — {currentCard.a}
                      </p>
                    </div>

                    {/* Card Actions */}
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => copyQuote(currentCard, 'card')}
                        className="px-3 py-2 rounded-lg text-xs font-medium transition-all"
                        style={{
                          background: copiedId === 'card' ? 'var(--accent-surface)' : 'var(--bg-secondary)',
                          color: copiedId === 'card' ? 'var(--accent-primary)' : 'var(--text-tertiary)',
                          border: '1px solid var(--border-primary)'
                        }}
                      >
                        {copiedId === 'card' ? '✓ Copied!' : '📋 Copy'}
                      </button>
                      <button
                        onClick={() => { saveQuote(currentCard); }}
                        className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${justSaved && isQuoteSaved(currentCard) ? 'aff-pop' : ''}`}
                        style={{
                          background: isQuoteSaved(currentCard) ? 'var(--accent-surface)' : 'var(--bg-secondary)',
                          color: isQuoteSaved(currentCard) ? 'var(--accent-primary)' : 'var(--text-tertiary)',
                          border: '1px solid var(--border-primary)'
                        }}
                      >
                        {isQuoteSaved(currentCard) ? '💜 Saved' : '🤍 Save'}
                      </button>
                    </div>
                  </div>
                </div>
              ) : null}

              {/* Draw Button */}
              <div className="mt-5 text-center">
                <button
                  onClick={drawNextCard}
                  disabled={isLoadingDeck || quoteDeck.length === 0}
                  className="aff-draw-btn group"
                  style={{
                    background: 'var(--accent-primary)',
                    color: '#fff',
                  }}
                >
                  <span className="relative z-10 flex items-center gap-2 text-sm font-semibold">
                    <svg className="w-4 h-4 transition-transform group-hover:rotate-180" style={{ transitionDuration: '500ms' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="23 4 23 10 17 10" />
                      <polyline points="1 20 1 14 7 14" />
                      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                    </svg>
                    Draw Next Quote
                  </span>
                </button>
                <p className="text-[11px] mt-2" style={{ color: 'var(--text-muted)' }}>
                  Tap to discover a new inspirational quote
                </p>
              </div>
            </div>
          </div>

          {/* ── Saved Quotes Section ───────────────────────────────── */}
          {showSaved && (
            <div
              className="rounded-2xl overflow-hidden animate-fade-in mb-8"
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)' }}
            >
              <div className="p-5 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border-primary)' }}>
                <div className="flex items-center gap-2">
                  <span className="text-lg">💜</span>
                  <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                    Saved Quotes
                  </h3>
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--accent-surface)', color: 'var(--accent-primary)' }}>
                    {savedQuotes.length}
                  </span>
                </div>
                <button
                  onClick={() => setShowSaved(false)}
                  className="p-1.5 rounded-lg transition-all text-sm"
                  style={{ color: 'var(--text-muted)' }}
                >
                  ✕
                </button>
              </div>

              {savedQuotes.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="text-3xl mb-3">🌟</div>
                  <p className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>No saved quotes yet</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    Save quotes that resonate with you
                  </p>
                </div>
              ) : (
                <div className="p-3 space-y-2 max-h-96 overflow-y-auto">
                  {savedQuotes.map((quote, index) => (
                    <div
                      key={`${quote.q}-${index}`}
                      className="rounded-xl p-4 transition-all group animate-fade-in"
                      style={{
                        background: 'var(--bg-tertiary)',
                        border: '1px solid var(--border-primary)',
                        animationDelay: `${index * 0.05}s`,
                        animationFillMode: 'backwards'
                      }}
                    >
                      <blockquote className="text-sm leading-relaxed mb-2" style={{ color: 'var(--text-primary)' }}>
                        &ldquo;{quote.q}&rdquo;
                      </blockquote>
                      <div className="flex items-center justify-between">
                        <p className="text-xs" style={{ color: 'var(--accent-primary)' }}>— {quote.a}</p>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => copyQuote(quote, `saved-${index}`)}
                            className="p-1.5 rounded-md text-[10px] transition-all"
                            style={{
                              background: copiedId === `saved-${index}` ? 'var(--accent-surface)' : 'transparent',
                              color: copiedId === `saved-${index}` ? 'var(--accent-primary)' : 'var(--text-muted)'
                            }}
                          >
                            {copiedId === `saved-${index}` ? '✓' : '📋'}
                          </button>
                          <button
                            onClick={() => removeSavedQuote(quote.q)}
                            className="p-1.5 rounded-md text-[10px] transition-all"
                            style={{ color: 'var(--text-muted)' }}
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── Achievement Section ────────────────────────────────── */}
          <div
            className="rounded-2xl p-5 animate-fade-in"
            style={{
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-primary)',
              animationDelay: '0.35s',
              animationFillMode: 'backwards'
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg">🏆</span>
              <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Achievements</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { icon: '🌱', title: 'First Visit', desc: 'Started your journey', unlocked: true },
                { icon: '⚡', title: '3-Day Streak', desc: 'Keep the momentum', unlocked: streak >= 3 },
                { icon: '🔥', title: '7-Day Streak', desc: 'A full week!', unlocked: streak >= 7 },
                { icon: '👑', title: '30-Day Streak', desc: 'Ultimate dedication', unlocked: streak >= 30 },
                { icon: '🎴', title: 'Explorer', desc: 'Discover 10 quotes', unlocked: totalDiscovered >= 10 },
                { icon: '📚', title: 'Collector', desc: 'Discover 50 quotes', unlocked: totalDiscovered >= 50 },
                { icon: '💜', title: 'Curator', desc: 'Save 5 quotes', unlocked: savedQuotes.length >= 5 },
                { icon: '🌟', title: 'Enthusiast', desc: 'Save 20 quotes', unlocked: savedQuotes.length >= 20 },
              ].map((achievement, i) => (
                <div
                  key={i}
                  className={`rounded-xl p-3 text-center transition-all ${achievement.unlocked ? '' : 'opacity-40 grayscale'}`}
                  style={{
                    background: achievement.unlocked ? 'var(--accent-surface)' : 'var(--bg-secondary)',
                    border: `1px solid ${achievement.unlocked ? 'var(--accent-border)' : 'var(--border-primary)'}`,
                  }}
                >
                  <div className="text-xl mb-1">{achievement.icon}</div>
                  <div className="text-[11px] font-semibold" style={{ color: achievement.unlocked ? 'var(--accent-primary)' : 'var(--text-muted)' }}>
                    {achievement.title}
                  </div>
                  <div className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    {achievement.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </DashboardLayout>
    </ChatProvider>
  );
}
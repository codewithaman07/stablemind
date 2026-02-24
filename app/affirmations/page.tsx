'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { ChatProvider } from '../context/ChatContext';
import { chatWithGemini } from '../services/geminiService';

interface Quote {
  quote: string;
  author: string;
  category: string;
}

const categories = [
  { id: 'inspirational', name: 'Inspirational', icon: '🌟' },
  { id: 'motivational', name: 'Motivational', icon: '💪' },
  { id: 'success', name: 'Success', icon: '🏆' },
  { id: 'happiness', name: 'Happiness', icon: '😊' },
  { id: 'wisdom', name: 'Wisdom', icon: '🧠' },
  { id: 'confidence', name: 'Confidence', icon: '✨' }
];

const fallbackQuotes: Quote[] = [
  {
    quote: "Believe in yourself and all that you are. Know that there is something inside you that is greater than any obstacle.",
    author: "Christian D. Larson",
    category: "confidence"
  },
  {
    quote: "Your potential is endless. Go do what you were created to do.",
    author: "Unknown",
    category: "motivational"
  }
];

const parseQuoteResponse = (response: string, category: string): Quote[] => {
  const cleanText = response.replace(/<[^>]*>/g, '').trim();
  const quotes: Quote[] = [];

  const numberedQuotePatterns = [
    /(?:Quote\s*)?(\d+)[:.]\s*["']([^"']+)["']\s*[-–—]\s*([^\n\r]+)/gi,
    /(?:Quote\s*)?(\d+)[:.]\s*["']([^"']+)["']\s*by\s+([^\n\r]+)/gi,
    /(?:Quote\s*)?(\d+)[:.]\s*["']([^"']+)["']\s*-\s*([^\n\r]+)/gi,
    /(\d+)[:.]\s*["']([^"']+)["']\s*[-–—]\s*([^\n\r]+)/gi
  ];

  for (const pattern of numberedQuotePatterns) {
    const matches = [...cleanText.matchAll(pattern)];
    if (matches.length > 0) {
      matches.forEach(match => {
        if (match[2] && match[2].trim().length > 10) {
          quotes.push({
            quote: match[2].trim(),
            author: match[3] ? match[3].trim() : 'Unknown',
            category: category
          });
        }
      });
      if (quotes.length > 0) return quotes;
    }
  }

  const generalQuotePatterns = [
    /["']([^"']{20,})["']\s*[-–—]\s*([^\n\r]+)/g,
    /["']([^"']{20,})["']\s*by\s+([^\n\r]+)/g,
    /["']([^"']{20,})["']\s*-\s*([^\n\r]+)/g
  ];

  for (const pattern of generalQuotePatterns) {
    const matches = [...cleanText.matchAll(pattern)];
    if (matches.length > 0) {
      matches.forEach(match => {
        quotes.push({
          quote: match[1].trim(),
          author: match[2] ? match[2].trim() : 'Unknown',
          category: category
        });
      });
      if (quotes.length > 0) return quotes;
    }
  }

  return quotes;
};

export default function AffirmationsPage() {
  const [quoteOfTheDay, setQuoteOfTheDay] = useState<Quote | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('inspirational');
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchQuoteOfTheDay();
  }, []);

  const fetchQuoteOfTheDay = async () => {
    try {
      const prompt = `Generate one inspiring motivational quote for students or professionals facing career challenges.

Please respond in this EXACT format:
"[Your complete quote here]" - [Author name or Unknown]

Example:
"Success is not final, failure is not fatal: it is the courage to continue that counts." - Winston Churchill

Make it uplifting and relevant to career growth.`;

      const response = await chatWithGemini(prompt);
      const quoteMatch = response.match(/["']([^"']+)["']\s*[-–—]\s*([^\n\r]+)/);

      if (quoteMatch && quoteMatch[1].trim().length > 10) {
        const quote: Quote = {
          quote: quoteMatch[1].trim(),
          author: quoteMatch[2] ? quoteMatch[2].trim().replace(/<[^>]*>/g, '') : 'Unknown',
          category: "inspirational"
        };
        setQuoteOfTheDay(quote);
        return;
      }
    } catch (error) {
      console.error('Error fetching quote from Gemini:', error);
    }

    const randomQuote = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
    setQuoteOfTheDay(randomQuote);
  };

  const fetchQuotesByCategory = async (category: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const prompt = `Generate exactly 3 inspiring ${category} quotes for students and professionals. Each quote should be complete and meaningful.

Please respond in this EXACT format:

1. "[First complete quote here]" - [Author name or Unknown]

2. "[Second complete quote here]" - [Author name or Unknown]

3. "[Third complete quote here]" - [Author name or Unknown]

Make sure each quote is complete and relates to ${category}. Do not cut off any quotes.`;

      const response = await chatWithGemini(prompt);
      const parsedQuotes = parseQuoteResponse(response, category);

      if (parsedQuotes.length > 0) {
        setQuotes(parsedQuotes);
      } else {
        setError('Generated quotes but had trouble parsing. Using fallback quotes.');
        const categoryQuotes = fallbackQuotes.filter(q => q.category === category);
        setQuotes(categoryQuotes.length > 0 ? categoryQuotes : fallbackQuotes);
      }
    } catch (error) {
      console.error('Error fetching quotes from Gemini:', error);
      setError('Unable to generate new quotes. Showing fallback quotes.');
      const categoryQuotes = fallbackQuotes.filter(q => q.category === category);
      setQuotes(categoryQuotes.length > 0 ? categoryQuotes : fallbackQuotes);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    fetchQuotesByCategory(selectedCategory);
  }, [selectedCategory]);

  const handleNewQuote = () => {
    fetchQuotesByCategory(selectedCategory);
  };

  const refreshQuoteOfTheDay = () => {
    fetchQuoteOfTheDay();
  };

  return (
    <ChatProvider>
      <DashboardLayout>
        <div className="max-w-4xl mx-auto p-4 sm:p-6">
          {/* Page header */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Daily Affirmations</h1>
            <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Start your day with inspiration and positivity</p>
          </div>

          {/* Quote of the Day */}
          {quoteOfTheDay && (
            <div className="rounded-xl p-6 mb-8" style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-primary)' }}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl" style={{ background: 'var(--accent-surface)' }}>☀️</div>
                  <div>
                    <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Quote of the Day</h2>
                    <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Your daily dose of inspiration</p>
                  </div>
                </div>
                <button
                  onClick={refreshQuoteOfTheDay}
                  className="px-3 py-1.5 rounded-lg text-sm transition-all"
                  style={{ background: 'var(--accent-surface)', color: 'var(--accent-primary)', border: '1px solid var(--accent-border)' }}
                  title="Refresh quote"
                >
                  🔄
                </button>
              </div>
              <blockquote className="text-lg italic leading-relaxed mb-3" style={{ color: 'var(--text-primary)' }}>
                &ldquo;{quoteOfTheDay.quote}&rdquo;
              </blockquote>
              <p className="text-sm text-right" style={{ color: 'var(--text-tertiary)' }}>— {quoteOfTheDay.author}</p>
            </div>
          )}

          {/* Categories */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--text-tertiary)' }}>Choose a Category</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className="p-3 rounded-xl transition-all text-center"
                  style={{
                    background: selectedCategory === category.id ? 'var(--accent-surface)' : 'var(--bg-tertiary)',
                    border: `1px solid ${selectedCategory === category.id ? 'var(--accent-primary)' : 'var(--border-primary)'}`,
                    color: selectedCategory === category.id ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  }}
                >
                  <div className="text-xl mb-1">{category.icon}</div>
                  <div className="text-xs font-medium">{category.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Quotes list */}
          <div className="rounded-xl p-6" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)' }}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-semibold capitalize" style={{ color: 'var(--text-primary)' }}>
                {selectedCategory} Quotes
              </h3>
              <button
                onClick={handleNewQuote}
                disabled={isLoading}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all text-white disabled:opacity-50"
                style={{ background: isLoading ? 'var(--bg-hover)' : 'var(--accent-primary)' }}
              >
                {isLoading ? 'Loading...' : 'Get New Quotes'}
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-lg mb-4 text-sm" style={{ background: 'var(--yellow-surface)', border: '1px solid rgba(245, 158, 11, 0.3)', color: 'var(--yellow-accent)' }}>
                {error}
              </div>
            )}

            {isLoading ? (
              <div className="text-center py-8">
                <div className="w-6 h-6 rounded-full mx-auto mb-3 animate-spin" style={{ border: '2px solid var(--border-primary)', borderTopColor: 'var(--accent-primary)' }} />
                <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Loading quotes...</p>
              </div>
            ) : (
              <div className="space-y-3">
                {quotes.map((quote, index) => (
                  <div
                    key={index}
                    className="rounded-xl p-4 transition-all"
                    style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-primary)' }}
                  >
                    <blockquote className="italic mb-2 leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                      &ldquo;{quote.quote}&rdquo;
                    </blockquote>
                    <p className="text-sm text-right" style={{ color: 'var(--text-tertiary)' }}>— {quote.author}</p>
                  </div>
                ))}
              </div>
            )}

            {quotes.length === 0 && !isLoading && (
              <div className="text-center py-8">
                <p style={{ color: 'var(--text-tertiary)' }}>No quotes available for this category.</p>
                <button
                  onClick={handleNewQuote}
                  className="mt-3 px-4 py-2 rounded-lg text-sm font-medium text-white transition-all"
                  style={{ background: 'var(--accent-primary)' }}
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>
    </ChatProvider>
  );
}
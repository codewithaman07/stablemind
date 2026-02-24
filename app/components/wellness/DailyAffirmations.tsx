'use client';

import { useState, useEffect } from 'react';
import { chatWithGemini } from '../../services/geminiService';

interface DailyAffirmationsProps {
  onBack: () => void;
}

interface Quote {
  quote: string;
  author: string;
  category: string;
}

const affirmationCategories = [
  { id: 'inspirational', name: 'Inspirational', icon: '🌟' },
  { id: 'motivational', name: 'Motivational', icon: '💪' },
  { id: 'success', name: 'Success', icon: '🏆' },
  { id: 'happiness', name: 'Happiness', icon: '😊' },
  { id: 'wisdom', name: 'Wisdom', icon: '🧠' },
  { id: 'confidence', name: 'Confidence', icon: '✨' }
];

const fallbackQuotes: Quote[] = [
  { quote: "Believe in yourself and all that you are. Know that there is something inside you that is greater than any obstacle.", author: "Christian D. Larson", category: "confidence" },
  { quote: "Your potential is endless. Go do what you were created to do.", author: "Unknown", category: "motivational" }
];

export default function DailyAffirmations({ onBack }: DailyAffirmationsProps) {
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
      const prompt = `Generate a single inspiring and motivational quote perfect for someone going through placement season or career challenges than should be uplifting, practical, and encourage perseverance.

Please respond with ONLY the quote in this exact format:
Quote: "[quote text]"
Author: [author name or "Unknown" if original]

Make it something that would truly motivate a student or young professional.`;

      const response = await chatWithGemini(prompt);
      const lines = response.split('\n');
      const quoteLine = lines.find(line => line.startsWith('Quote:'));
      const authorLine = lines.find(line => line.startsWith('Author:'));

      if (quoteLine && authorLine) {
        const quoteText = quoteLine.replace(/^Quote:\s*["']/, '').replace(/["']$/, '').trim();
        const authorText = authorLine.replace(/^Author:\s*/, '').trim();

        setQuoteOfTheDay({
          quote: quoteText.replace(/<[^>]*>/g, ''),
          author: authorText.replace(/<[^>]*>/g, ''),
          category: "inspirational"
        });
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
      const prompt = `Generate 2 inspiring ${category} quotes that would motivate students during placement season.

Please respond with EXACTLY this format:
Quote 1: "[quote text]" - [Author name or "Unknown"]
Quote 2: "[quote text]" - [Author name or "Unknown"]

Make them relevant to ${category}.`;

      const response = await chatWithGemini(prompt);

      const parsedQuotes: Quote[] = response
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.startsWith('Quote'))
        .map(line => {
          const match = line.match(/^Quote \d+:\s*"([^"]+)"\s*-\s*(.+)$/);
          if (match) {
            return {
              quote: match[1].trim().replace(/<[^>]*>/g, ''),
              author: match[2].trim().replace(/<[^>]*>/g, ''),
              category: category
            };
          }
          return null;
        })
        .filter(Boolean) as Quote[];

      if (parsedQuotes.length > 0) {
        setQuotes(parsedQuotes.slice(0, 2));
        setIsLoading(false);
        return;
      }
    } catch (error) {
      console.error('Error fetching quotes from Gemini:', error);
      setError('Using offline quotes');
    }

    const categoryQuotes = fallbackQuotes.filter(q => q.category === category);
    setQuotes(categoryQuotes.length > 0 ? categoryQuotes.slice(0, 2) : fallbackQuotes.slice(0, 2));
    setIsLoading(false);
  };

  useEffect(() => {
    fetchQuotesByCategory(selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="flex flex-col rounded-xl overflow-hidden h-full" style={{ background: 'var(--bg-secondary)' }}>
      <div className="p-3 border-b" style={{ background: 'var(--bg-tertiary)', borderColor: 'var(--border-primary)' }}>
        <h2 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>Daily Affirmations</h2>
        <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Inspiration and positivity</p>
      </div>

      <div className="flex-1 p-3 overflow-y-auto">
        {/* Quote of the Day */}
        {quoteOfTheDay && (
          <div className="rounded-xl p-4 mb-4" style={{ background: 'var(--accent-surface)', border: '1px solid var(--accent-border)' }}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm">☀️</span>
              <h3 className="text-xs font-semibold" style={{ color: 'var(--accent-primary)' }}>Quote of the Day</h3>
            </div>
            <blockquote className="text-xs italic leading-relaxed mb-2" style={{ color: 'var(--text-primary)' }}>
              &ldquo;{quoteOfTheDay.quote}&rdquo;
            </blockquote>
            <p className="text-xs text-right" style={{ color: 'var(--text-tertiary)' }}>— {quoteOfTheDay.author}</p>
          </div>
        )}

        {/* Categories */}
        <div className="mb-4">
          <h4 className="text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Categories</h4>
          <div className="grid grid-cols-2 gap-1.5">
            {affirmationCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className="p-2 rounded-lg transition-all text-xs text-center"
                style={{
                  background: selectedCategory === category.id ? 'var(--accent-surface)' : 'var(--bg-tertiary)',
                  border: `1px solid ${selectedCategory === category.id ? 'var(--accent-primary)' : 'var(--border-primary)'}`,
                  color: selectedCategory === category.id ? 'var(--accent-primary)' : 'var(--text-secondary)',
                }}
              >
                <div className="text-sm mb-0.5">{category.icon}</div>
                <div className="text-xs font-medium">{category.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Quotes */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-semibold capitalize" style={{ color: 'var(--text-primary)' }}>
              {selectedCategory}
            </h4>
            <button
              onClick={() => fetchQuotesByCategory(selectedCategory)}
              disabled={isLoading}
              className="px-2 py-1 rounded-md text-xs transition-all"
              style={{ background: 'var(--accent-surface)', color: 'var(--accent-primary)', border: '1px solid var(--accent-border)' }}
            >
              {isLoading ? '...' : 'New'}
            </button>
          </div>

          {error && (
            <div className="p-2 rounded-lg text-xs mb-2" style={{ background: 'var(--yellow-surface)', border: '1px solid rgba(245, 158, 11, 0.3)', color: 'var(--yellow-accent)' }}>
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="text-center py-4">
              <div className="w-4 h-4 rounded-full mx-auto animate-spin" style={{ border: '2px solid var(--border-primary)', borderTopColor: 'var(--accent-primary)' }} />
            </div>
          ) : (
            <div className="space-y-2">
              {quotes.slice(0, 2).map((quote, index) => (
                <div key={index} className="rounded-lg p-3" style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-primary)' }}>
                  <blockquote className="text-xs italic mb-1" style={{ color: 'var(--text-primary)' }}>
                    &ldquo;{quote.quote}&rdquo;
                  </blockquote>
                  <p className="text-xs text-right" style={{ color: 'var(--text-muted)' }}>— {quote.author}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={onBack}
            className="flex-1 px-3 py-2 rounded-lg text-sm transition-all"
            style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)', border: '1px solid var(--border-primary)' }}
          >
            Back
          </button>
          <button
            onClick={() => window.open('/affirmations', '_blank')}
            className="flex-1 px-3 py-2 rounded-lg text-sm font-medium text-white transition-all"
            style={{ background: 'var(--accent-primary)' }}
          >
            Full Page
          </button>
        </div>
      </div>
    </div>
  );
}
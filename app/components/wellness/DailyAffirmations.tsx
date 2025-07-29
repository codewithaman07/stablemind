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
  { id: 'inspirational', name: 'Inspirational', icon: '🌟', color: 'bg-yellow-500' },
  { id: 'motivational', name: 'Motivational', icon: '💪', color: 'bg-red-500' },
  { id: 'success', name: 'Success', icon: '🏆', color: 'bg-green-500' },
  { id: 'happiness', name: 'Happiness', icon: '😊', color: 'bg-pink-500' },
  { id: 'wisdom', name: 'Wisdom', icon: '🧠', color: 'bg-purple-500' },
  { id: 'confidence', name: 'Confidence', icon: '✨', color: 'bg-blue-500' }
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

export default function DailyAffirmations({ onBack }: DailyAffirmationsProps) {
  const [quoteOfTheDay, setQuoteOfTheDay] = useState<Quote | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('inspirational');
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get quote of the day (cached per day)
  useEffect(() => {
    const today = new Date().toDateString();
    const cachedQuote = localStorage.getItem('quoteOfTheDay');
    const cachedDate = localStorage.getItem('quoteOfTheDayDate');

    if (cachedQuote && cachedDate === today) {
      setQuoteOfTheDay(JSON.parse(cachedQuote));
    } else {
      fetchQuoteOfTheDay();
    }
  }, []);

  const fetchQuoteOfTheDay = async () => {
    try {
      const prompt = `Generate a single inspiring and motivational quote perfect for someone going through placement season or career challenges. The quote should be uplifting, practical, and encourage perseverance. 

Please respond with ONLY the quote in this exact format:
Quote: "[quote text]"
Author: [author name or "Unknown" if original]

Make it something that would truly motivate a student or young professional.`;

      const response = await chatWithGemini(prompt);
      
      // More robust parsing without complex regex
      const lines = response.split('\n');
      const quoteLine = lines.find(line => line.startsWith('Quote:'));
      const authorLine = lines.find(line => line.startsWith('Author:'));

      if (quoteLine && authorLine) {
        const quoteText = quoteLine.replace(/^Quote:\s*["']/, '').replace(/["']$/, '').trim();
        const authorText = authorLine.replace(/^Author:\s*/, '').trim();

        const quote: Quote = {
          quote: quoteText.replace(/<[^>]*>/g, ''),
          author: authorText.replace(/<[^>]*>/g, ''),
          category: "inspirational"
        };
        
        const today = new Date().toDateString();
        setQuoteOfTheDay(quote);
        localStorage.setItem('quoteOfTheDay', JSON.stringify(quote));
        localStorage.setItem('quoteOfTheDayDate', today);
        return;
      }
    } catch (error) {
      console.error('Error fetching quote from Gemini:', error);
    }
    
    // Fallback to random quote from our small collection
    const randomQuote = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
    const today = new Date().toDateString();
    
    setQuoteOfTheDay(randomQuote);
    localStorage.setItem('quoteOfTheDay', JSON.stringify(randomQuote));
    localStorage.setItem('quoteOfTheDayDate', today);
  };

  const fetchQuotesByCategory = async (category: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const prompt = `Generate 2 inspiring ${category} quotes that would motivate students during placement season. Each quote should be meaningful and uplifting.

Please respond with EXACTLY this format for each quote:
Quote 1: "[quote text]" - [Author name or "Unknown"]
Quote 2: "[quote text]" - [Author name or "Unknown"]

Make them relevant to ${category} and perfect for someone facing career challenges.`;

      const response = await chatWithGemini(prompt);
      
      // More robust parsing by splitting lines instead of a single large regex
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
        setQuotes(parsedQuotes.slice(0, 2)); // Show first 2 for sidebar
        setIsLoading(false);
        return;
      }
    } catch (error) {
      console.error('Error fetching quotes from Gemini:', error);
      setError('Using offline quotes');
    }
    
    // Fallback to our small collection
    const categoryQuotes = fallbackQuotes.filter(q => q.category === category);
    if (categoryQuotes.length > 0) {
      setQuotes(categoryQuotes.slice(0, 2));
    } else {
      setQuotes(fallbackQuotes.slice(0, 2));
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchQuotesByCategory(selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="flex flex-col bg-gray-900 rounded-lg shadow-lg overflow-hidden h-full">
      <div className="p-3 bg-gray-800 text-white">
        <h2 className="text-lg font-medium">Daily Affirmations</h2>
        <p className="text-sm text-gray-400">Inspiration and positivity</p>
      </div>

      <div className="flex-1 p-3 overflow-y-auto">
        {/* Quote of the Day */}
        {quoteOfTheDay && (
          <div className="bg-gradient-to-r from-purple-800 to-indigo-800 rounded-lg p-4 mb-4 border border-purple-600">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-lg">
                ☀️
              </div>
              <h3 className="text-sm font-semibold text-white">Quote of the Day</h3>
            </div>
            
            <blockquote className="text-sm text-white mb-2 italic leading-relaxed">
              &ldquo;{quoteOfTheDay.quote}&rdquo;
            </blockquote>
            
            <p className="text-purple-300 text-xs text-right">— {quoteOfTheDay.author}</p>
          </div>
        )}

        {/* Category Selection */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-white mb-2">Categories</h4>
          <div className="grid grid-cols-2 gap-2">
            {affirmationCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`p-2 rounded-md transition-all text-xs ${
                  selectedCategory === category.id
                    ? `${category.color} text-white`
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <div className="text-sm mb-1">{category.icon}</div>
                <div className="text-xs font-medium">{category.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Quotes */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold text-white capitalize">
              {selectedCategory}
            </h4>
            <button
              onClick={() => fetchQuotesByCategory(selectedCategory)}
              disabled={isLoading}
              className="px-2 py-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 text-white rounded text-xs transition-colors"
            >
              {isLoading ? '...' : 'New'}
            </button>
          </div>

          {error && (
            <div className="bg-yellow-900 border border-yellow-700 text-yellow-300 p-2 rounded text-xs mb-2">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="text-center py-4">
              <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-500"></div>
            </div>
          ) : (
            <div className="space-y-2">
              {quotes.slice(0, 2).map((quote, index) => (
                <div
                  key={index}
                  className="bg-gray-800 rounded-md p-3 border border-gray-700"
                >
                  {/* ✅ FIX: Removed the length check and substring to show the full quote */}
                  <blockquote className="text-gray-200 text-xs mb-1 italic">
                    &ldquo;{quote.quote}&rdquo;
                  </blockquote>
                  <p className="text-gray-400 text-xs text-right">— {quote.author}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={onBack}
            className="flex-1 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors"
          >
            Back
          </button>
          <button
            onClick={() => window.open('/affirmations', '_blank')}
            className="flex-1 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm transition-colors"
          >
            Full Page
          </button>
        </div>
      </div>
    </div>
  );
}
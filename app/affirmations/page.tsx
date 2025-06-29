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

// Improved quote parsing function
const parseQuoteResponse = (response: string, category: string): Quote[] => {
  const cleanText = response.replace(/<[^>]*>/g, '').trim();
  console.log('Raw response:', cleanText); // Debug log
  
  const quotes: Quote[] = [];
  
  // Try multiple parsing strategies
  
  // Strategy 1: Look for numbered quotes with various formats
  const numberedQuotePatterns = [
    /(?:Quote\s*)?(\d+)[:.\s]*["']([^"']+)["']\s*[-–—]\s*([^\n\r]+)/gi,
    /(?:Quote\s*)?(\d+)[:.\s]*["']([^"']+)["']\s*by\s+([^\n\r]+)/gi,
    /(?:Quote\s*)?(\d+)[:.\s]*["']([^"']+)["']\s*-\s*([^\n\r]+)/gi,
    /(\d+)[:.\s]*["']([^"']+)["']\s*[-–—]\s*([^\n\r]+)/gi
  ];
  
  for (const pattern of numberedQuotePatterns) {
    const matches = [...cleanText.matchAll(pattern)];
    if (matches.length > 0) {
      matches.forEach(match => {
        if (match[2] && match[2].trim().length > 10) { // Ensure quote is substantial
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
  
  // Strategy 2: Look for quotes without numbers
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
  
  // Strategy 3: Split by line and look for quote-like patterns
  const lines = cleanText.split('\n').filter(line => line.trim().length > 0);
  let currentQuote = '';
  let currentAuthor = '';
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Look for lines that start with quotes
    if (line.match(/^["']/) && line.length > 20) {
      currentQuote = line.replace(/^["']|["']$/g, '');
      
      // Look for author in next few lines
      for (let j = i + 1; j < Math.min(i + 3, lines.length); j++) {
        const nextLine = lines[j].trim();
        if (nextLine.match(/^[-–—]/) || nextLine.toLowerCase().includes('author') || nextLine.match(/^by\s/i)) {
          currentAuthor = nextLine.replace(/^[-–—]\s*|^author:?\s*|^by\s*/i, '').trim();
          break;
        }
      }
      
      if (currentQuote.length > 10) {
        quotes.push({
          quote: currentQuote,
          author: currentAuthor || 'Unknown',
          category: category
        });
        currentQuote = '';
        currentAuthor = '';
      }
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
  const [pageWidth, setPageWidth] = useState<string>('max-w-6xl');

  const widthOptions = [
    { value: 'max-w-2xl', label: 'Narrow' },
    { value: 'max-w-4xl', label: 'Medium' },
    { value: 'max-w-6xl', label: 'Wide' },
    { value: 'max-w-full', label: 'Full Width' }
  ];

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
      const prompt = `Generate one inspiring motivational quote for students or professionals facing career challenges. 

Please respond in this EXACT format:
"[Your complete quote here]" - [Author name or Unknown]

Example:
"Success is not final, failure is not fatal: it is the courage to continue that counts." - Winston Churchill

Make it uplifting and relevant to career growth.`;

      const response = await chatWithGemini(prompt);
      console.log('Quote of the day response:', response);
      
      // Simple parsing for single quote
      const quoteMatch = response.match(/["']([^"']+)["']\s*[-–—]\s*([^\n\r]+)/);
      
      if (quoteMatch && quoteMatch[1].trim().length > 10) {
        const quote: Quote = {
          quote: quoteMatch[1].trim(),
          author: quoteMatch[2] ? quoteMatch[2].trim().replace(/<[^>]*>/g, '') : 'Unknown',
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
    
    // Fallback
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
      const prompt = `Generate exactly 3 inspiring ${category} quotes for students and professionals. Each quote should be complete and meaningful.

Please respond in this EXACT format:

1. "[First complete quote here]" - [Author name or Unknown]

2. "[Second complete quote here]" - [Author name or Unknown]

3. "[Third complete quote here]" - [Author name or Unknown]

Make sure each quote is complete and relates to ${category}. Do not cut off any quotes.`;

      const response = await chatWithGemini(prompt);
      console.log('Category quotes response:', response);
      
      const parsedQuotes = parseQuoteResponse(response, category);
      
      if (parsedQuotes.length > 0) {
        setQuotes(parsedQuotes);
      } else {
        // If parsing failed, try fallback parsing
        console.log('Parsing failed, trying fallback...');
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
    localStorage.removeItem('quoteOfTheDay');
    localStorage.removeItem('quoteOfTheDayDate');
    fetchQuoteOfTheDay();
  };

  return (
    <ChatProvider>
      <DashboardLayout>
        <div className={`${pageWidth} mx-auto p-4 sm:p-6`}>
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Daily Affirmations</h1>
              <p className="text-gray-400">Start your day with inspiration and positivity</p>
            </div>
            
            {/* Width Control */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Width:</span>
              <select 
                value={pageWidth}
                onChange={(e) => setPageWidth(e.target.value)}
                className="bg-gray-800 text-white px-3 py-1 rounded-lg border border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {widthOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quote of the Day */}
          {quoteOfTheDay && (
            <div className="bg-gradient-to-r from-purple-900 to-indigo-900 rounded-xl p-6 mb-8 border border-purple-700">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center text-2xl">
                    ☀️
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white">Quote of the Day</h2>
                    <p className="text-purple-300 text-sm">Your daily dose of inspiration</p>
                  </div>
                </div>
                <button
                  onClick={refreshQuoteOfTheDay}
                  className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition-colors"
                  title="Refresh quote"
                >
                  🔄
                </button>
              </div>
              
              <blockquote className="text-lg sm:text-xl text-white mb-4 italic leading-relaxed">
                &ldquo;{quoteOfTheDay.quote}&rdquo;
              </blockquote>
              
              <p className="text-purple-300 text-right">— {quoteOfTheDay.author}</p>
            </div>
          )}

          {/* Category Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">Choose a Category</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`p-3 rounded-lg transition-all duration-200 ${
                    selectedCategory === category.id
                      ? `${category.color} text-white shadow-lg scale-105`
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <div className="text-2xl mb-1">{category.icon}</div>
                  <div className="text-xs sm:text-sm font-medium">{category.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Selected Category Quotes */}
          <div className="bg-gray-900 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white capitalize">
                {selectedCategory} Quotes
              </h3>
              <button
                onClick={handleNewQuote}
                disabled={isLoading}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 text-white rounded-lg text-sm transition-colors"
              >
                {isLoading ? 'Loading...' : 'Get New Quotes'}
              </button>
            </div>

            {error && (
              <div className="bg-yellow-900 border border-yellow-700 text-yellow-300 p-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            {isLoading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                <p className="text-gray-400 mt-2">Loading quotes...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {quotes.map((quote, index) => (
                  <div
                    key={index}
                    className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors"
                  >
                    <blockquote className="text-gray-200 mb-2 italic">
                      &ldquo;{quote.quote}&rdquo;
                    </blockquote>
                    <p className="text-gray-400 text-sm text-right">— {quote.author}</p>
                  </div>
                ))}
              </div>
            )}

            {quotes.length === 0 && !isLoading && (
              <div className="text-center py-8 text-gray-400">
                <p>No quotes available for this category.</p>
                <button
                  onClick={handleNewQuote}
                  className="mt-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm transition-colors"
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
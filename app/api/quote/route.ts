import { NextRequest, NextResponse } from 'next/server';

// Cache quotes server-side
let cachedDailyQuote: { q: string; a: string } | null = null;
let dailyCacheTime = 0;
let cachedBatchQuotes: { q: string; a: string }[] = [];
let batchCacheTime = 0;
const DAILY_CACHE_DURATION = 60 * 60 * 1000; // 1 hour
const BATCH_CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

const fallbackQuotes = [
    { q: "The only way to do great work is to love what you do.", a: "Steve Jobs" },
    { q: "Believe you can and you're halfway there.", a: "Theodore Roosevelt" },
    { q: "It is during our darkest moments that we must focus to see the light.", a: "Aristotle" },
    { q: "You are never too old to set another goal or to dream a new dream.", a: "C.S. Lewis" },
    { q: "The best time to plant a tree was 20 years ago. The second best time is now.", a: "Chinese Proverb" },
    { q: "Your mental health is a priority. Your happiness is essential. Your self-care is a necessity.", a: "Unknown" },
    { q: "In the middle of every difficulty lies opportunity.", a: "Albert Einstein" },
    { q: "What lies behind us and what lies before us are tiny matters compared to what lies within us.", a: "Ralph Waldo Emerson" },
    { q: "You don't have to control your thoughts. You just have to stop letting them control you.", a: "Dan Millman" },
    { q: "The greatest glory in living lies not in never falling, but in rising every time we fall.", a: "Nelson Mandela" },
    { q: "Happiness is not something ready made. It comes from your own actions.", a: "Dalai Lama" },
    { q: "Act as if what you do makes a difference. It does.", a: "William James" },
    { q: "Success is not final, failure is not fatal: it is the courage to continue that counts.", a: "Winston Churchill" },
    { q: "The only impossible journey is the one you never begin.", a: "Tony Robbins" },
    { q: "Everything you've ever wanted is on the other side of fear.", a: "George Addair" },
    { q: "Hardships often prepare ordinary people for an extraordinary destiny.", a: "C.S. Lewis" },
];

export async function GET(request: NextRequest) {
    const mode = request.nextUrl.searchParams.get('mode') || 'today';

    try {
        if (mode === 'today') {
            return await fetchDailyQuote();
        } else if (mode === 'quotes') {
            return await fetchBatchQuotes();
        } else if (mode === 'random') {
            return await fetchRandomQuote();
        }

        return NextResponse.json({ error: 'Invalid mode' }, { status: 400 });
    } catch (error) {
        console.error('Quote API error:', error);
        return NextResponse.json(getRandomFallback());
    }
}

async function fetchDailyQuote() {
    const now = Date.now();
    if (cachedDailyQuote && (now - dailyCacheTime) < DAILY_CACHE_DURATION) {
        return NextResponse.json(cachedDailyQuote);
    }

    try {
        const response = await fetch('https://zenquotes.io/api/today', {
            next: { revalidate: 3600 },
        });

        if (!response.ok) throw new Error('ZenQuotes API error');
        const data = await response.json();

        if (data && data.length > 0 && data[0].q) {
            cachedDailyQuote = { q: data[0].q, a: data[0].a };
            dailyCacheTime = now;
            return NextResponse.json(cachedDailyQuote);
        }
    } catch (e) {
        console.error('Daily quote fetch failed:', e);
    }

    return NextResponse.json(getRandomFallback());
}

async function fetchBatchQuotes() {
    const now = Date.now();
    if (cachedBatchQuotes.length > 0 && (now - batchCacheTime) < BATCH_CACHE_DURATION) {
        return NextResponse.json(cachedBatchQuotes);
    }

    try {
        const response = await fetch('https://zenquotes.io/api/quotes', {
            next: { revalidate: 1800 },
        });

        if (!response.ok) throw new Error('ZenQuotes API error');
        const data = await response.json();

        if (data && data.length > 0) {
            cachedBatchQuotes = data
                .filter((q: { q: string; a: string }) => q.q && q.a)
                .map((q: { q: string; a: string }) => ({ q: q.q, a: q.a }));
            batchCacheTime = now;
            return NextResponse.json(cachedBatchQuotes);
        }
    } catch (e) {
        console.error('Batch quotes fetch failed:', e);
    }

    return NextResponse.json(fallbackQuotes);
}

async function fetchRandomQuote() {
    try {
        const response = await fetch('https://zenquotes.io/api/random', {
            cache: 'no-store',
        });

        if (!response.ok) throw new Error('ZenQuotes API error');
        const data = await response.json();

        if (data && data.length > 0 && data[0].q) {
            return NextResponse.json({ q: data[0].q, a: data[0].a });
        }
    } catch (e) {
        console.error('Random quote fetch failed:', e);
    }

    return NextResponse.json(getRandomFallback());
}

function getRandomFallback() {
    return fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
}

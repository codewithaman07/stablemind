-- ═══════════════════════════════════════════════════════════════════
-- StableMind Database Schema
-- Run this in Supabase SQL Editor: Dashboard → SQL Editor → New Query
-- ═══════════════════════════════════════════════════════════════════

-- 1. Mood Entries
CREATE TABLE IF NOT EXISTS mood_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  mood INTEGER NOT NULL CHECK (mood >= 1 AND mood <= 5),
  mood_label TEXT NOT NULL,
  note TEXT DEFAULT '',
  emoji TEXT NOT NULL,
  color TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_mood_entries_user ON mood_entries(user_id, created_at DESC);

-- 2. Chat Sessions
CREATE TABLE IF NOT EXISTS chat_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT DEFAULT 'New Chat',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_chat_sessions_user ON chat_sessions(user_id, updated_at DESC);

-- 3. Chat Messages
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_chat_messages_session ON chat_messages(session_id, created_at ASC);

-- 4. Saved Quotes
CREATE TABLE IF NOT EXISTS saved_quotes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  quote TEXT NOT NULL,
  author TEXT NOT NULL,
  saved_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_saved_quotes_user ON saved_quotes(user_id, saved_at DESC);

-- 5. User Stats (streaks, discovery count)
CREATE TABLE IF NOT EXISTS user_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT UNIQUE NOT NULL,
  streak INTEGER DEFAULT 1,
  last_visit DATE DEFAULT CURRENT_DATE,
  quotes_discovered INTEGER DEFAULT 0
);

CREATE INDEX idx_user_stats_user ON user_stats(user_id);

-- ═══════════════════════════════════════════════════════════════════
-- Row Level Security (RLS)
-- Uses Clerk JWT: the 'sub' claim contains the Clerk user ID.
-- To integrate, configure Supabase to verify Clerk JWTs:
--   Dashboard → Settings → API → JWT Secret → set to your Clerk JWT secret
-- ═══════════════════════════════════════════════════════════════════

-- Enable RLS on all tables
ALTER TABLE mood_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

-- Drop insecure policies if they exist (to allow re-running this script safely)
DROP POLICY IF EXISTS "Allow all for mood_entries" ON mood_entries;
DROP POLICY IF EXISTS "Allow all for chat_sessions" ON chat_sessions;
DROP POLICY IF EXISTS "Allow all for chat_messages" ON chat_messages;
DROP POLICY IF EXISTS "Allow all for saved_quotes" ON saved_quotes;
DROP POLICY IF EXISTS "Allow all for user_stats" ON user_stats;

-- Secure Policies
-- Enforce user isolation using Clerk's 'sub' claim

CREATE POLICY "Users can access their own mood entries" ON mood_entries
FOR ALL USING ((auth.jwt() ->> 'sub') = user_id)
WITH CHECK ((auth.jwt() ->> 'sub') = user_id);

CREATE POLICY "Users can access their own chat sessions" ON chat_sessions
FOR ALL USING ((auth.jwt() ->> 'sub') = user_id)
WITH CHECK ((auth.jwt() ->> 'sub') = user_id);

CREATE POLICY "Users can access their own chat messages" ON chat_messages
FOR ALL USING (
  session_id IN (
    SELECT id FROM chat_sessions WHERE user_id = (auth.jwt() ->> 'sub')
  )
)
WITH CHECK (
  session_id IN (
    SELECT id FROM chat_sessions WHERE user_id = (auth.jwt() ->> 'sub')
  )
);

CREATE POLICY "Users can access their own saved quotes" ON saved_quotes
FOR ALL USING ((auth.jwt() ->> 'sub') = user_id)
WITH CHECK ((auth.jwt() ->> 'sub') = user_id);

CREATE POLICY "Users can access their own stats" ON user_stats
FOR ALL USING ((auth.jwt() ->> 'sub') = user_id)
WITH CHECK ((auth.jwt() ->> 'sub') = user_id);

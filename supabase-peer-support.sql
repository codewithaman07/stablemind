
-- 1. Anonymous Posts
CREATE TABLE IF NOT EXISTS peer_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  support_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_peer_posts_created ON peer_posts(created_at DESC);
CREATE INDEX idx_peer_posts_category ON peer_posts(category, created_at DESC);

-- 2. Anonymous Replies
CREATE TABLE IF NOT EXISTS peer_replies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES peer_posts(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_peer_replies_post ON peer_replies(post_id, created_at ASC);

-- 3. Support tracking (prevent duplicate supports)
CREATE TABLE IF NOT EXISTS peer_supports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES peer_posts(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(post_id, user_id)
);

-- Enable RLS
ALTER TABLE peer_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE peer_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE peer_supports ENABLE ROW LEVEL SECURITY;

-- Drop insecure policies if they exist
DROP POLICY IF EXISTS "Allow all for peer_posts" ON peer_posts;
DROP POLICY IF EXISTS "Allow all for peer_replies" ON peer_replies;
DROP POLICY IF EXISTS "Allow all for peer_supports" ON peer_supports;

-- Secure Policies

-- Peer Posts
-- Anyone authenticated can read posts
CREATE POLICY "Authenticated users can read peer posts" ON peer_posts
FOR SELECT USING (auth.role() = 'authenticated');

-- Users can only create/update/delete their own posts
CREATE POLICY "Users can manage their own peer posts" ON peer_posts
FOR ALL USING ((auth.jwt() ->> 'sub') = user_id)
WITH CHECK ((auth.jwt() ->> 'sub') = user_id);


-- Peer Replies
-- Anyone authenticated can read replies
CREATE POLICY "Authenticated users can read peer replies" ON peer_replies
FOR SELECT USING (auth.role() = 'authenticated');

-- Users can only create/update/delete their own replies
CREATE POLICY "Users can manage their own peer replies" ON peer_replies
FOR ALL USING ((auth.jwt() ->> 'sub') = user_id)
WITH CHECK ((auth.jwt() ->> 'sub') = user_id);


-- Peer Supports
-- Anyone authenticated can read supports (needed for counting)
CREATE POLICY "Authenticated users can read peer supports" ON peer_supports
FOR SELECT USING (auth.role() = 'authenticated');

-- Users can only create/delete their own supports
CREATE POLICY "Users can manage their own supports" ON peer_supports
FOR ALL USING ((auth.jwt() ->> 'sub') = user_id)
WITH CHECK ((auth.jwt() ->> 'sub') = user_id);



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

-- Allow all via anon key (Clerk handles auth, app handles user_id filtering)
-- Trigger to update support_count
CREATE OR REPLACE FUNCTION update_support_count()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    UPDATE peer_posts SET support_count = support_count + 1 WHERE id = NEW.post_id;
  ELSIF (TG_OP = 'DELETE') THEN
    UPDATE peer_posts SET support_count = support_count - 1 WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS tr_update_support_count ON peer_supports;
CREATE TRIGGER tr_update_support_count
AFTER INSERT OR DELETE ON peer_supports
FOR EACH ROW EXECUTE FUNCTION update_support_count();

-- Secure RLS Policies

-- Peer Posts
DROP POLICY IF EXISTS "Allow all for peer_posts" ON peer_posts;
CREATE POLICY "Public read for peer_posts" ON peer_posts FOR SELECT USING (true);
CREATE POLICY "Users can create their own posts" ON peer_posts FOR INSERT WITH CHECK ((auth.jwt() ->> 'sub') = user_id);
CREATE POLICY "Users can update their own posts" ON peer_posts FOR UPDATE USING ((auth.jwt() ->> 'sub') = user_id);
CREATE POLICY "Users can delete their own posts" ON peer_posts FOR DELETE USING ((auth.jwt() ->> 'sub') = user_id);

-- Peer Replies
DROP POLICY IF EXISTS "Allow all for peer_replies" ON peer_replies;
CREATE POLICY "Public read for peer_replies" ON peer_replies FOR SELECT USING (true);
CREATE POLICY "Users can create their own replies" ON peer_replies FOR INSERT WITH CHECK ((auth.jwt() ->> 'sub') = user_id);
CREATE POLICY "Users can update their own replies" ON peer_replies FOR UPDATE USING ((auth.jwt() ->> 'sub') = user_id);
CREATE POLICY "Users can delete their own replies" ON peer_replies FOR DELETE USING ((auth.jwt() ->> 'sub') = user_id);

-- Peer Supports
DROP POLICY IF EXISTS "Allow all for peer_supports" ON peer_supports;
CREATE POLICY "Users can view their own supports" ON peer_supports FOR SELECT USING ((auth.jwt() ->> 'sub') = user_id);
CREATE POLICY "Users can create their own supports" ON peer_supports FOR INSERT WITH CHECK ((auth.jwt() ->> 'sub') = user_id);
CREATE POLICY "Users can delete their own supports" ON peer_supports FOR DELETE USING ((auth.jwt() ->> 'sub') = user_id);

import { supabase } from './supabase';

// ─── Types ───────────────────────────────────────────────────────────────────
export interface MoodEntryDB {
    id?: string;
    user_id: string;
    mood: number;
    mood_label: string;
    note: string;
    emoji: string;
    color: string;
    created_at?: string;
}

export interface ChatSessionDB {
    id?: string;
    user_id: string;
    title: string;
    created_at?: string;
    updated_at?: string;
}

export interface ChatMessageDB {
    id?: string;
    session_id: string;
    role: string;
    content: string;
    created_at?: string;
}

export interface SavedQuoteDB {
    id?: string;
    user_id: string;
    quote: string;
    author: string;
    saved_at?: string;
}

export interface UserStatsDB {
    id?: string;
    user_id: string;
    streak: number;
    last_visit: string;
    quotes_discovered: number;
}

// ─── Mood Entries ────────────────────────────────────────────────────────────
export async function saveMoodEntry(entry: Omit<MoodEntryDB, 'id' | 'created_at'>) {
    const { data, error } = await supabase
        .from('mood_entries')
        .insert(entry)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function getMoodEntries(userId: string, limit = 10) {
    const { data, error } = await supabase
        .from('mood_entries')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

    if (error) throw error;
    return data || [];
}

// ─── Chat Sessions ───────────────────────────────────────────────────────────
export async function createChatSession(userId: string, title = 'New Chat') {
    const { data, error } = await supabase
        .from('chat_sessions')
        .insert({ user_id: userId, title })
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function getChatSessions(userId: string, limit = 20) {
    const { data, error } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })
        .limit(limit);

    if (error) throw error;
    return data || [];
}

export async function updateChatSessionTitle(sessionId: string, title: string) {
    const { error } = await supabase
        .from('chat_sessions')
        .update({ title, updated_at: new Date().toISOString() })
        .eq('id', sessionId);

    if (error) throw error;
}

export async function deleteChatSession(sessionId: string) {
    // Delete messages first
    await supabase
        .from('chat_messages')
        .delete()
        .eq('session_id', sessionId);

    const { error } = await supabase
        .from('chat_sessions')
        .delete()
        .eq('id', sessionId);

    if (error) throw error;
}

// ─── Chat Messages ───────────────────────────────────────────────────────────
export async function saveChatMessage(message: Omit<ChatMessageDB, 'id' | 'created_at'>) {
    const { data, error } = await supabase
        .from('chat_messages')
        .insert(message)
        .select()
        .single();

    if (error) throw error;

    // Update session timestamp
    await supabase
        .from('chat_sessions')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', message.session_id);

    return data;
}

export async function getChatMessages(sessionId: string) {
    const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
}

// ─── Saved Quotes ────────────────────────────────────────────────────────────
export async function saveQuote(userId: string, quote: string, author: string) {
    // Check if already saved
    const { data: existing } = await supabase
        .from('saved_quotes')
        .select('id')
        .eq('user_id', userId)
        .eq('quote', quote)
        .single();

    if (existing) return existing;

    const { data, error } = await supabase
        .from('saved_quotes')
        .insert({ user_id: userId, quote, author })
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function getSavedQuotes(userId: string) {
    const { data, error } = await supabase
        .from('saved_quotes')
        .select('*')
        .eq('user_id', userId)
        .order('saved_at', { ascending: false });

    if (error) throw error;
    return data || [];
}

export async function deleteSavedQuote(userId: string, quote: string) {
    const { error } = await supabase
        .from('saved_quotes')
        .delete()
        .eq('user_id', userId)
        .eq('quote', quote);

    if (error) throw error;
}

// ─── User Stats ──────────────────────────────────────────────────────────────
export async function getUserStats(userId: string): Promise<UserStatsDB | null> {
    const { data, error } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', userId)
        .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = not found
    return data;
}

export async function updateUserStats(userId: string): Promise<UserStatsDB> {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    const existing = await getUserStats(userId);

    if (!existing) {
        // First visit ever
        const { data, error } = await supabase
            .from('user_stats')
            .insert({
                user_id: userId,
                streak: 1,
                last_visit: today,
                quotes_discovered: 0,
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    const lastVisit = existing.last_visit;

    if (lastVisit === today) {
        return existing; // Already visited today
    }

    let newStreak = 1;
    if (lastVisit === yesterday) {
        newStreak = existing.streak + 1;
    }

    const { data, error } = await supabase
        .from('user_stats')
        .update({ streak: newStreak, last_visit: today })
        .eq('user_id', userId)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function incrementQuotesDiscovered(userId: string, count = 1): Promise<number> {
    const stats = await getUserStats(userId);
    const newCount = (stats?.quotes_discovered || 0) + count;

    if (stats) {
        await supabase
            .from('user_stats')
            .update({ quotes_discovered: newCount })
            .eq('user_id', userId);
    } else {
        await supabase
            .from('user_stats')
            .insert({
                user_id: userId,
                streak: 1,
                last_visit: new Date().toISOString().split('T')[0],
                quotes_discovered: newCount,
            });
    }

    return newCount;
}

// ─── Peer Support ────────────────────────────────────────────────────────────
export interface PeerPostDB {
    id?: string;
    user_id: string;
    content: string;
    category: string;
    support_count: number;
    created_at?: string;
    reply_count?: number;
    user_has_supported?: boolean;
}

export interface PeerReplyDB {
    id?: string;
    post_id: string;
    user_id: string;
    content: string;
    created_at?: string;
}

export async function createPeerPost(userId: string, content: string, category = 'general') {
    // Server-side validation
    const trimmed = content.trim();
    if (!trimmed || trimmed.length < 2) throw new Error('Post content is too short');
    if (trimmed.length > 1000) throw new Error('Post content exceeds 1000 characters');

    const { data, error } = await supabase
        .from('peer_posts')
        .insert({ user_id: userId, content: trimmed, category })
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function getPeerPosts(userId: string, category?: string, limit = 30) {
    let query = supabase
        .from('peer_posts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

    if (category && category !== 'all') {
        query = query.eq('category', category);
    }

    const { data: posts, error } = await query;
    if (error) throw error;
    if (!posts || posts.length === 0) return [];

    // Get reply counts
    const postIds = posts.map((p: PeerPostDB) => p.id!);
    const { data: replies } = await supabase
        .from('peer_replies')
        .select('post_id')
        .in('post_id', postIds);

    const replyCounts: Record<string, number> = {};
    (replies || []).forEach((r: { post_id: string }) => {
        replyCounts[r.post_id] = (replyCounts[r.post_id] || 0) + 1;
    });

    // Check which posts this user has supported
    const { data: supports } = await supabase
        .from('peer_supports')
        .select('post_id')
        .eq('user_id', userId)
        .in('post_id', postIds);

    const supportedSet = new Set((supports || []).map((s: { post_id: string }) => s.post_id));

    return posts.map((post: PeerPostDB) => ({
        ...post,
        reply_count: replyCounts[post.id!] || 0,
        user_has_supported: supportedSet.has(post.id!),
    }));
}

export async function createPeerReply(userId: string, postId: string, content: string) {
    // Server-side validation
    const trimmed = content.trim();
    if (!trimmed || trimmed.length < 1) throw new Error('Reply content is empty');
    if (trimmed.length > 500) throw new Error('Reply content exceeds 500 characters');

    const { data, error } = await supabase
        .from('peer_replies')
        .insert({ post_id: postId, user_id: userId, content: trimmed })
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function getPeerReplies(postId: string) {
    const { data, error } = await supabase
        .from('peer_replies')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
}

export async function toggleSupport(userId: string, postId: string): Promise<boolean> {
    // Check if already supported
    const { data: existing } = await supabase
        .from('peer_supports')
        .select('id')
        .eq('user_id', userId)
        .eq('post_id', postId)
        .single();

    if (existing) {
        // Remove support
        await supabase.from('peer_supports').delete().eq('id', existing.id);
    } else {
        // Add support (unique constraint prevents duplicates)
        await supabase.from('peer_supports').insert({ user_id: userId, post_id: postId });
    }

    // Derive count from source of truth (peer_supports table) to avoid race conditions
    const { count } = await supabase
        .from('peer_supports')
        .select('*', { count: 'exact', head: true })
        .eq('post_id', postId);

    await supabase
        .from('peer_posts')
        .update({ support_count: count || 0 })
        .eq('id', postId);

    return !existing;
}

export async function deletePeerPost(userId: string, postId: string) {
    const { error } = await supabase
        .from('peer_posts')
        .delete()
        .eq('id', postId)
        .eq('user_id', userId);

    if (error) throw error;
}


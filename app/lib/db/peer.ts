import { supabase } from '../supabase';

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

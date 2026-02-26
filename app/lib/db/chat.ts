import { supabase } from '../supabase';

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

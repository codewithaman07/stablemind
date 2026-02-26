import { supabase } from '../supabase';

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

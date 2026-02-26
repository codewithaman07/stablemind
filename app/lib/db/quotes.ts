import { supabase } from '../supabase';

export interface SavedQuoteDB {
    id?: string;
    user_id: string;
    quote: string;
    author: string;
    saved_at?: string;
}

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

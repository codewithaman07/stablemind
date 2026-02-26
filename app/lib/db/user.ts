import { supabase } from '../supabase';

export interface UserStatsDB {
    id?: string;
    user_id: string;
    streak: number;
    last_visit: string;
    quotes_discovered: number;
}

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

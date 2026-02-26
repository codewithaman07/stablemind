// ─── Anonymous avatar generator ────────────────────────────────────────────
export const AVATARS = ['🦊', '🐼', '🦋', '🌸', '🍀', '🌊', '🔮', '🎭', '🦉', '🐢', '🌺', '🍄', '🦩', '🐙', '🌵', '🎪'];
export const COLORS = [
    '#6366f1', '#8b5cf6', '#a855f7', '#d946ef',
    '#ec4899', '#f43f5e', '#ef4444', '#f97316',
    '#eab308', '#22c55e', '#14b8a6', '#06b6d4',
    '#3b82f6', '#6366f1', '#10a37f', '#0ea5e9',
];

export function getAnonymousIdentity(seed: string) {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        hash = ((hash << 5) - hash) + seed.charCodeAt(i);
        hash |= 0;
    }
    const idx = Math.abs(hash);
    return {
        avatar: AVATARS[idx % AVATARS.length],
        color: COLORS[idx % COLORS.length],
        name: `Anonymous ${AVATARS[idx % AVATARS.length]}`,
    };
}

export function timeAgo(dateStr: string): string {
    const now = Date.now();
    const then = new Date(dateStr).getTime();
    const diff = Math.floor((now - then) / 1000);
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return new Date(dateStr).toLocaleDateString();
}

export const CATEGORIES = [
    { id: 'all', label: 'All', emoji: '🌐' },
    { id: 'venting', label: 'Venting', emoji: '💨' },
    { id: 'anxiety', label: 'Anxiety', emoji: '😰' },
    { id: 'motivation', label: 'Motivation', emoji: '💪' },
    { id: 'gratitude', label: 'Gratitude', emoji: '🙏' },
    { id: 'advice', label: 'Advice', emoji: '💡' },
    { id: 'celebration', label: 'Wins', emoji: '🎉' },
    { id: 'general', label: 'General', emoji: '💬' },
];

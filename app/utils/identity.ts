// ─── Anonymous avatar generator ────────────────────────────────────────────
const AVATARS = ['🦊', '🐼', '🦋', '🌸', '🍀', '🌊', '🔮', '🎭', '🦉', '🐢', '🌺', '🍄', '🦩', '🐙', '🌵', '🎪'];
const COLORS = [
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

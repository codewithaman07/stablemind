import { PeerPostDB } from '../lib/db/peer';
import { CATEGORIES, getAnonymousIdentity, timeAgo } from '../lib/community';

export default function PostCard({
    post,
    userId,
    onSupportToggle,
    onOpenReplies,
}: {
    post: PeerPostDB;
    userId: string;
    onSupportToggle: (postId: string) => void;
    onOpenReplies: (post: PeerPostDB) => void;
}) {
    const identity = getAnonymousIdentity(post.user_id + (post.id || '').slice(0, 4));
    const categoryInfo = CATEGORIES.find(c => c.id === post.category) || CATEGORIES[CATEGORIES.length - 1];
    const isOwn = post.user_id === userId;

    return (
        <div
            className="rounded-2xl p-5 transition-all animate-fade-in"
            style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-primary)',
            }}
        >
            {/* Header */}
            <div className="flex items-center gap-3 mb-3">
                <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                    style={{ background: `${identity.color}20`, border: `1px solid ${identity.color}40` }}
                >
                    {identity.avatar}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                            {identity.name}
                        </span>
                        {isOwn && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ background: 'var(--accent-surface)', color: 'var(--accent-primary)' }}>
                                You
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                            {post.created_at ? timeAgo(post.created_at) : ''}
                        </span>
                        <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-tertiary)' }}>
                            {categoryInfo.emoji} {categoryInfo.label}
                        </span>
                    </div>
                </div>
            </div>

            {/* Content */}
            <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-primary)' }}>
                {post.content}
            </p>

            {/* Actions */}
            <div className="flex items-center gap-3">
                <button
                    onClick={() => onSupportToggle(post.id!)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${post.user_has_supported ? 'scale-105' : ''}`}
                    style={{
                        background: post.user_has_supported ? 'var(--accent-surface)' : 'var(--bg-tertiary)',
                        color: post.user_has_supported ? 'var(--accent-primary)' : 'var(--text-tertiary)',
                        border: `1px solid ${post.user_has_supported ? 'var(--accent-border)' : 'transparent'}`,
                    }}
                >
                    {post.user_has_supported ? '💚' : '🤍'} {post.support_count || 0}
                </button>
                <button
                    onClick={() => onOpenReplies(post)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                    style={{ background: 'var(--bg-tertiary)', color: 'var(--text-tertiary)' }}
                >
                    💬 {post.reply_count || 0} {(post.reply_count || 0) === 1 ? 'Reply' : 'Replies'}
                </button>
            </div>
        </div>
    );
}

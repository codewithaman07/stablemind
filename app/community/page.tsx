'use client';

import { useState, useEffect, useRef } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useUser } from '@clerk/nextjs';
import { ChatProvider } from '../context/ChatContext';
import {
    createPeerPost,
    getPeerPosts,
    createPeerReply,
    getPeerReplies,
    toggleSupport,
    PeerPostDB,
    PeerReplyDB,
} from '../lib/database';
import { getAnonymousIdentity } from '../utils/identity';

function timeAgo(dateStr: string): string {
    const now = Date.now();
    const then = new Date(dateStr).getTime();
    const diff = Math.floor((now - then) / 1000);
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return new Date(dateStr).toLocaleDateString();
}

const CATEGORIES = [
    { id: 'all', label: 'All', emoji: '🌐' },
    { id: 'venting', label: 'Venting', emoji: '💨' },
    { id: 'anxiety', label: 'Anxiety', emoji: '😰' },
    { id: 'motivation', label: 'Motivation', emoji: '💪' },
    { id: 'gratitude', label: 'Gratitude', emoji: '🙏' },
    { id: 'advice', label: 'Advice', emoji: '💡' },
    { id: 'celebration', label: 'Wins', emoji: '🎉' },
    { id: 'general', label: 'General', emoji: '💬' },
];

// ─── Post Card ─────────────────────────────────────────────────────────────
function PostCard({
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

// ─── Reply Thread Modal ─────────────────────────────────────────────────────
function ReplyThread({
    post,
    userId,
    onClose,
    onSupportToggle,
}: {
    post: PeerPostDB;
    userId: string;
    onClose: () => void;
    onSupportToggle: (postId: string) => void;
}) {
    const [replies, setReplies] = useState<PeerReplyDB[]>([]);
    const [replyText, setReplyText] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        async function load() {
            try {
                const data = await getPeerReplies(post.id!);
                setReplies(data);
            } catch (err) {
                console.error('Failed to load replies:', err);
            } finally {
                setIsLoading(false);
            }
        }
        load();
    }, [post.id]);

    useEffect(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }, [replies]);

    const sendReply = async () => {
        if (!replyText.trim() || isSending) return;
        setIsSending(true);
        try {
            const reply = await createPeerReply(userId, post.id!, replyText.trim());
            setReplies(prev => [...prev, reply]);
            setReplyText('');
        } catch (err) {
            console.error('Failed to send reply:', err);
        } finally {
            setIsSending(false);
        }
    };

    const postIdentity = getAnonymousIdentity(post.user_id + (post.id || '').slice(0, 4));

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" onClick={onClose}>
            <div className="absolute inset-0 bg-black/60" />
            <div
                className="relative w-full sm:max-w-lg max-h-[85vh] sm:max-h-[80vh] rounded-t-2xl sm:rounded-2xl flex flex-col overflow-hidden animate-fade-in"
                style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-primary)' }}
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex-shrink-0 p-4 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border-primary)' }}>
                    <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>Thread</h3>
                    <button onClick={onClose} className="p-1.5 rounded-lg text-sm" style={{ color: 'var(--text-muted)' }}>✕</button>
                </div>

                {/* Original Post */}
                <div className="flex-shrink-0 p-4" style={{ borderBottom: '1px solid var(--border-primary)' }}>
                    <div className="flex items-center gap-2.5 mb-2">
                        <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
                            style={{ background: `${postIdentity.color}20` }}
                        >
                            {postIdentity.avatar}
                        </div>
                        <div>
                            <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{postIdentity.name}</span>
                            <span className="text-xs ml-2" style={{ color: 'var(--text-muted)' }}>{post.created_at ? timeAgo(post.created_at) : ''}</span>
                        </div>
                    </div>
                    <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-primary)' }}>{post.content}</p>
                    <button
                        onClick={() => onSupportToggle(post.id!)}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs transition-all"
                        style={{
                            background: post.user_has_supported ? 'var(--accent-surface)' : 'var(--bg-tertiary)',
                            color: post.user_has_supported ? 'var(--accent-primary)' : 'var(--text-tertiary)',
                        }}
                    >
                        {post.user_has_supported ? '💚' : '🤍'} {post.support_count || 0}
                    </button>
                </div>

                {/* Replies */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
                    {isLoading ? (
                        <div className="text-center py-6">
                            <div className="w-5 h-5 rounded-full mx-auto animate-spin" style={{ border: '2px solid var(--border-primary)', borderTopColor: 'var(--accent-primary)' }} />
                        </div>
                    ) : replies.length === 0 ? (
                        <div className="text-center py-8">
                            <div className="text-2xl mb-2">🌱</div>
                            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No replies yet. Be the first to show support!</p>
                        </div>
                    ) : (
                        replies.map((reply) => {
                            const replyIdentity = getAnonymousIdentity(reply.user_id + (reply.id || '').slice(0, 4));
                            const isOwn = reply.user_id === userId;
                            return (
                                <div key={reply.id} className="flex gap-2.5 animate-fade-in">
                                    <div
                                        className="w-7 h-7 rounded-lg flex items-center justify-center text-xs flex-shrink-0 mt-0.5"
                                        style={{ background: `${replyIdentity.color}20` }}
                                    >
                                        {replyIdentity.avatar}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-1.5 mb-0.5">
                                            <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{replyIdentity.name}</span>
                                            {isOwn && (
                                                <span className="text-[9px] px-1 py-0.5 rounded-full" style={{ background: 'var(--accent-surface)', color: 'var(--accent-primary)' }}>You</span>
                                            )}
                                            <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{reply.created_at ? timeAgo(reply.created_at) : ''}</span>
                                        </div>
                                        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{reply.content}</p>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Reply Input */}
                <div className="flex-shrink-0 p-3" style={{ borderTop: '1px solid var(--border-primary)', background: 'var(--bg-secondary)' }}>
                    <div className="flex items-end gap-2">
                        <textarea
                            value={replyText}
                            onChange={e => setReplyText(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendReply(); } }}
                            placeholder="Write an anonymous reply..."
                            className="flex-1 px-3 py-2 rounded-xl text-sm resize-none focus:outline-none"
                            style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)', minHeight: '2.5rem', maxHeight: '6rem' }}
                            rows={1}
                            maxLength={500}
                        />
                        <button
                            onClick={sendReply}
                            disabled={!replyText.trim() || isSending}
                            className="px-4 py-2 rounded-xl text-sm font-medium text-white transition-all disabled:opacity-40"
                            style={{ background: 'var(--accent-primary)' }}
                        >
                            {isSending ? '...' : 'Send'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Main Page ──────────────────────────────────────────────────────────────
function PeerSupportContent() {
    const { user } = useUser();
    const userId = user?.id || 'guest';
    const [posts, setPosts] = useState<PeerPostDB[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('all');
    const [newPost, setNewPost] = useState('');
    const [newPostCategory, setNewPostCategory] = useState('general');
    const [isPosting, setIsPosting] = useState(false);
    const [activeThread, setActiveThread] = useState<PeerPostDB | null>(null);
    const [showCompose, setShowCompose] = useState(false);

    const loadPosts = async (category?: string) => {
        setIsLoading(true);
        try {
            const data = await getPeerPosts(userId, category || activeCategory);
            setPosts(data);
        } catch (err) {
            console.error('Failed to load posts:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadPosts();
    }, [activeCategory, userId]);

    const handlePost = async () => {
        if (!newPost.trim() || isPosting || userId === 'guest') return;
        setIsPosting(true);
        try {
            const post = await createPeerPost(userId, newPost.trim(), newPostCategory);
            setPosts(prev => [{ ...post, reply_count: 0, user_has_supported: false }, ...prev]);
            setNewPost('');
            setShowCompose(false);
        } catch (err) {
            console.error('Failed to create post:', err);
        } finally {
            setIsPosting(false);
        }
    };

    const handleSupportToggle = async (postId: string) => {
        if (userId === 'guest') return;
        try {
            const isNowSupported = await toggleSupport(userId, postId);
            setPosts(prev => prev.map(p => {
                if (p.id === postId) {
                    return {
                        ...p,
                        user_has_supported: isNowSupported,
                        support_count: isNowSupported
                            ? (p.support_count || 0) + 1
                            : Math.max(0, (p.support_count || 1) - 1),
                    };
                }
                return p;
            }));
            // Also update active thread if open
            if (activeThread?.id === postId) {
                setActiveThread(prev => prev ? {
                    ...prev,
                    user_has_supported: isNowSupported,
                    support_count: isNowSupported
                        ? (prev.support_count || 0) + 1
                        : Math.max(0, (prev.support_count || 1) - 1),
                } : null);
            }
        } catch (err) {
            console.error('Failed to toggle support:', err);
        }
    };

    return (
        <div className="h-full w-full flex flex-col" style={{ background: 'var(--bg-primary)' }}>
            {/* Header */}
            <div className="flex-shrink-0 w-full p-4 sm:p-6" style={{ borderBottom: '1px solid var(--border-primary)', background: 'var(--bg-secondary)' }}>
                <div className="max-w-2xl mx-auto">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
                                Peer Support
                            </h1>
                            <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>
                                Share anonymously. Support each other. You&apos;re not alone.
                            </p>
                        </div>
                        <button
                            onClick={() => setShowCompose(!showCompose)}
                            className="px-4 py-2.5 rounded-xl text-sm font-medium text-white transition-all"
                            style={{ background: 'var(--accent-primary)' }}
                        >
                            {showCompose ? '✕ Close' : '✍️ Share'}
                        </button>
                    </div>

                    {/* Category Filter */}
                    <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1" style={{ scrollbarWidth: 'none' }}>
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap flex-shrink-0"
                                style={{
                                    background: activeCategory === cat.id ? 'var(--accent-surface)' : 'var(--bg-tertiary)',
                                    color: activeCategory === cat.id ? 'var(--accent-primary)' : 'var(--text-tertiary)',
                                    border: `1px solid ${activeCategory === cat.id ? 'var(--accent-border)' : 'transparent'}`,
                                }}
                            >
                                {cat.emoji} {cat.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Compose Area */}
            {showCompose && (
                <div className="flex-shrink-0 p-4 sm:p-6 animate-fade-in" style={{ borderBottom: '1px solid var(--border-primary)', background: 'var(--bg-secondary)' }}>
                    <div className="max-w-2xl mx-auto">
                        <div className="rounded-2xl p-4" style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-primary)' }}>
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm" style={{ background: 'var(--accent-surface)' }}>
                                    🎭
                                </div>
                                <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                                    Posting anonymously
                                </span>
                            </div>
                            <textarea
                                value={newPost}
                                onChange={e => setNewPost(e.target.value)}
                                placeholder="What's on your mind? Share your thoughts, feelings, or ask for advice..."
                                className="w-full p-3 rounded-xl text-sm resize-none focus:outline-none leading-relaxed"
                                style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', minHeight: '5rem' }}
                                rows={3}
                                maxLength={1000}
                            />
                            <div className="flex items-center justify-between mt-3">
                                <div className="flex items-center gap-1.5">
                                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Category:</span>
                                    <select
                                        value={newPostCategory}
                                        onChange={e => setNewPostCategory(e.target.value)}
                                        className="px-2 py-1 rounded-lg text-xs focus:outline-none"
                                        style={{ background: 'var(--bg-primary)', color: 'var(--text-secondary)', border: '1px solid var(--border-primary)' }}
                                    >
                                        {CATEGORIES.filter(c => c.id !== 'all').map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.emoji} {cat.label}</option>
                                        ))}
                                    </select>
                                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{newPost.length}/1000</span>
                                </div>
                                <button
                                    onClick={handlePost}
                                    disabled={!newPost.trim() || isPosting || userId === 'guest'}
                                    className="px-5 py-2 rounded-xl text-sm font-medium text-white transition-all disabled:opacity-40"
                                    style={{ background: 'var(--accent-primary)' }}
                                >
                                    {isPosting ? 'Posting...' : 'Post Anonymously'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Posts Feed */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                <div className="max-w-2xl mx-auto space-y-4">
                    {isLoading ? (
                        <div className="text-center py-12">
                            <div className="w-6 h-6 rounded-full mx-auto mb-3 animate-spin" style={{ border: '2px solid var(--border-primary)', borderTopColor: 'var(--accent-primary)' }} />
                            <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Loading posts...</p>
                        </div>
                    ) : posts.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="text-4xl mb-4">🌱</div>
                            <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                                {activeCategory === 'all' ? 'No posts yet' : `No ${CATEGORIES.find(c => c.id === activeCategory)?.label || ''} posts yet`}
                            </h3>
                            <p className="text-sm mb-5" style={{ color: 'var(--text-muted)' }}>
                                Be the first to share. Everything is completely anonymous.
                            </p>
                            <button
                                onClick={() => setShowCompose(true)}
                                className="px-5 py-2.5 rounded-xl text-sm font-medium text-white"
                                style={{ background: 'var(--accent-primary)' }}
                            >
                                ✍️ Share Something
                            </button>
                        </div>
                    ) : (
                        posts.map(post => (
                            <PostCard
                                key={post.id}
                                post={post}
                                userId={userId}
                                onSupportToggle={handleSupportToggle}
                                onOpenReplies={setActiveThread}
                            />
                        ))
                    )}
                </div>
            </div>

            {/* Reply Thread Modal */}
            {activeThread && (
                <ReplyThread
                    post={activeThread}
                    userId={userId}
                    onClose={() => {
                        setActiveThread(null);
                        loadPosts(); // Refresh to get updated reply counts
                    }}
                    onSupportToggle={handleSupportToggle}
                />
            )}
        </div>
    );
}

export default function CommunityPage() {
    const { isSignedIn, isLoaded } = useUser();
    if (!isLoaded) return null;

    return (
        <ChatProvider>
            <DashboardLayout isGuestMode={!isSignedIn}>
                <PeerSupportContent />
            </DashboardLayout>
        </ChatProvider>
    );
}

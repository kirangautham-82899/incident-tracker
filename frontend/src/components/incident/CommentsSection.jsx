import React, { useState, useEffect } from 'react';
import { Send, X, MessageCircle } from 'lucide-react';
import useAuthStore from '../../stores/authStore';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const CommentsSection = ({ incidentId }) => {
    const { user, isAuthenticated } = useAuthStore();
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);

    useEffect(() => {
        fetchComments();
    }, [incidentId]);

    const fetchComments = async () => {
        try {
            const response = await api.get(`/incidents/${incidentId}/comments`);
            setComments(response.data.data || []);
        } catch (error) {
            console.error('Failed to fetch comments:', error);
        } finally {
            setIsFetching(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setIsLoading(true);
        try {
            const response = await api.post(`/incidents/${incidentId}/comments`, {
                content: newComment
            });

            setComments([response.data.data, ...comments]);
            setNewComment('');
            toast.success('Comment added');
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to add comment');
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) {
        return (
            <div className="p-4 text-center text-gray-500 text-sm font-mono">
                Loading comments...
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 text-white mb-3">
                <MessageCircle className="w-5 h-5" />
                <h3 className="text-lg font-bold">Comments ({comments.length})</h3>
            </div>

            {/* Add Comment Form */}
            {isAuthenticated ? (
                <form onSubmit={handleSubmit} className="flex gap-2">
                    <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                        className="flex-1 px-4 py-2 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all text-sm"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !newComment.trim()}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-xl transition-all flex items-center gap-2 text-sm font-bold"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </form>
            ) : (
                <div className="p-3 rounded-xl bg-slate-900/50 border border-white/10 text-center text-sm text-gray-400">
                    Login to add comments
                </div>
            )}

            {/* Comments List */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
                {comments.length === 0 ? (
                    <div className="p-6 text-center text-gray-500 text-sm font-mono">
                        No comments yet. Be the first to comment!
                    </div>
                ) : (
                    comments.map((comment) => (
                        <CommentCard key={comment._id} comment={comment} />
                    ))
                )}
            </div>
        </div>
    );
};

const CommentCard = ({ comment }) => {
    const getRoleBadge = (role) => {
        const badges = {
            admin: { label: 'Admin', color: 'red' },
            responder: { label: 'Responder', color: 'blue' },
            citizen: { label: 'Citizen', color: 'gray' }
        };
        return badges[role] || badges.citizen;
    };

    const badge = getRoleBadge(comment.userRole);

    return (
        <div className="p-4 rounded-xl bg-slate-900/50 border border-white/10 hover:border-white/20 transition-all">
            <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-sm font-bold">
                        {comment.userName?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-white">{comment.userName}</span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-${badge.color}-500/20 text-${badge.color}-400 border border-${badge.color}-500/30`}>
                                {badge.label}
                            </span>
                        </div>
                        <span className="text-xs text-gray-500">
                            {new Date(comment.createdAt).toLocaleString()}
                        </span>
                    </div>
                </div>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">{comment.content}</p>
        </div>
    );
};

export default CommentsSection;

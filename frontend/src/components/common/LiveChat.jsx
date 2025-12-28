import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Minimize2 } from 'lucide-react';
import useAuthStore from '../../stores/authStore';
import socketService from '../../utils/socket';
import toast from 'react-hot-toast';

const LiveChat = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [unreadCount, setUnreadCount] = useState(0);
    const messagesEndRef = useRef(null);
    const { user, isAuthenticated } = useAuthStore();

    useEffect(() => {
        // Listen for incoming chat messages
        socketService.on('chat_message', (message) => {
            setMessages(prev => [...prev, message]);

            // Increment unread count if chat is closed or minimized
            if (!isOpen || isMinimized) {
                setUnreadCount(prev => prev + 1);
            }
        });

        return () => {
            socketService.off('chat_message');
        };
    }, [isOpen, isMinimized]);

    useEffect(() => {
        // Auto-scroll to bottom when new message arrives
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    useEffect(() => {
        // Reset unread count when chat is opened
        if (isOpen && !isMinimized) {
            setUnreadCount(0);
        }
    }, [isOpen, isMinimized]);

    const handleSendMessage = (e) => {
        e.preventDefault();

        if (!newMessage.trim() || !isAuthenticated) {
            if (!isAuthenticated) {
                toast.error('Please login to use chat');
            }
            return;
        }

        const message = {
            id: Date.now(),
            text: newMessage,
            sender: {
                name: user?.name || 'Anonymous',
                role: user?.role || 'citizen'
            },
            timestamp: new Date().toISOString()
        };

        // Add to local state immediately
        setMessages(prev => [...prev, message]);

        // Emit to server
        socketService.emit('chat_message', message);

        setNewMessage('');
    };

    const getRoleBadgeColor = (role) => {
        switch (role) {
            case 'admin':
                return 'bg-red-500/20 text-red-400 border-red-500/30';
            case 'responder':
                return 'bg-green-500/20 text-green-400 border-green-500/30';
            case 'bot':
                return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
            default:
                return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
        }
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 z-50 p-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-full shadow-2xl transition-all duration-300 hover:scale-110 group"
            >
                <MessageCircle className="w-6 h-6" />
                {unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold animate-pulse">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </div>
                )}
                <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-50 group-hover:opacity-70 transition-opacity -z-10"></div>
            </button>
        );
    }

    return (
        <div className={`fixed bottom-6 right-6 z-50 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl transition-all duration-300 ${isMinimized ? 'w-80 h-16' : 'w-96 h-[500px]'
            }`}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-gradient-to-r from-blue-600/20 to-purple-600/20">
                <div className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-blue-400" />
                    <h3 className="font-bold text-white">Live Support Chat</h3>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsMinimized(!isMinimized)}
                        className="p-1.5 hover:bg-white/10 rounded-lg transition-all"
                    >
                        <Minimize2 className="w-4 h-4 text-gray-400" />
                    </button>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-1.5 hover:bg-white/10 rounded-lg transition-all"
                    >
                        <X className="w-4 h-4 text-gray-400" />
                    </button>
                </div>
            </div>

            {!isMinimized && (
                <>
                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 h-[360px]">
                        {messages.length === 0 ? (
                            <div className="text-center py-12">
                                <MessageCircle className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                                <p className="text-gray-500 text-sm">No messages yet</p>
                                <p className="text-gray-600 text-xs mt-1">Start the conversation!</p>
                            </div>
                        ) : (
                            messages.map((msg) => {
                                const isOwn = msg.sender.name === user?.name;
                                return (
                                    <div
                                        key={msg.id}
                                        className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`max-w-[75%] ${isOwn ? 'order-2' : 'order-1'}`}>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-xs font-bold text-gray-400">
                                                    {msg.sender.name}
                                                </span>
                                                <span className={`px-2 py-0.5 rounded text-xs font-bold border ${getRoleBadgeColor(msg.sender.role)}`}>
                                                    {msg.sender.role}
                                                </span>
                                            </div>
                                            <div className={`px-4 py-2 rounded-2xl ${isOwn
                                                ? 'bg-blue-600 text-white rounded-tr-none'
                                                : 'bg-slate-800 text-gray-200 rounded-tl-none'
                                                }`}>
                                                <p className="text-sm">{msg.text}</p>
                                            </div>
                                            <span className="text-xs text-gray-500 mt-1 block">
                                                {new Date(msg.timestamp).toLocaleTimeString()}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t border-white/10">
                        {isAuthenticated ? (
                            <form onSubmit={handleSendMessage} className="flex gap-2">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type a message..."
                                    className="flex-1 px-4 py-2 bg-slate-800 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all text-sm"
                                />
                                <button
                                    type="submit"
                                    disabled={!newMessage.trim()}
                                    className="p-2 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-xl transition-all"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </form>
                        ) : (
                            <div className="text-center py-2">
                                <p className="text-xs text-gray-500">Please login to use chat</p>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default LiveChat;

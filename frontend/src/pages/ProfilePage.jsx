import React, { useEffect, useState } from 'react';
import { Trophy, Award, Star, TrendingUp, Target, Shield } from 'lucide-react';
import useAuthStore from '../stores/authStore';
import useIncidentStore from '../stores/incidentStore';
import { getEarnedBadges, calculateLevel, getNextBadge } from '../utils/gamification';
import Navbar from '../components/layout/Navbar';

const ProfilePage = () => {
    const { user } = useAuthStore();
    const { incidents } = useIncidentStore();
    const [userStats, setUserStats] = useState(null);

    useEffect(() => {
        if (user) {
            const earnedBadges = getEarnedBadges(user);
            const level = calculateLevel(user.reputation);
            const nextBadge = getNextBadge(user);

            // Calculate user-specific stats
            const userIncidents = incidents.filter(inc => inc.reporter?.userId?._id === user._id || inc.reporter?.userId === user._id);
            const verifiedIncidents = userIncidents.filter(inc => inc.verificationCount > 0);

            setUserStats({
                earnedBadges,
                level,
                nextBadge,
                totalReports: user.incidentsReported || 0,
                verified: user.incidentsVerified || 0,
                verificationRate: userIncidents.length > 0 ? ((verifiedIncidents.length / userIncidents.length) * 100).toFixed(0) : 0
            });
        }
    }, [user, incidents]);

    if (!user || !userStats) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="text-gray-500">Loading profile...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white">
            {/* Background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.05]"></div>
            </div>

            <Navbar />

            <div className="pt-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
                {/* Profile Header */}
                <div className="mb-8 p-8 rounded-3xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-white/10 backdrop-blur-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px]"></div>

                    <div className="relative flex items-center gap-6">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-4xl font-black">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h1 className="text-4xl font-black mb-2">{user.name}</h1>
                            <div className="flex items-center gap-4">
                                <span className={`px-3 py-1 rounded-full text-sm font-bold bg-${userStats.level.color}-500/20 text-${userStats.level.color}-400 border border-${userStats.level.color}-500/30`}>
                                    Level {userStats.level.level} - {userStats.level.name}
                                </span>
                                <div className="flex items-center gap-2 text-yellow-400">
                                    <Star className="w-5 h-5 fill-current" />
                                    <span className="font-bold">{user.reputation} Reputation</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <StatCard
                        icon={Target}
                        label="Reports Submitted"
                        value={userStats.totalReports}
                        color="blue"
                    />
                    <StatCard
                        icon={Shield}
                        label="Verifications"
                        value={userStats.verified}
                        color="green"
                    />
                    <StatCard
                        icon={TrendingUp}
                        label="Verification Rate"
                        value={`${userStats.verificationRate}%`}
                        color="purple"
                    />
                </div>

                {/* Badges Section */}
                <div className="mb-8 p-6 rounded-2xl bg-slate-900/50 border border-white/10 backdrop-blur-xl">
                    <div className="flex items-center gap-3 mb-6">
                        <Trophy className="w-6 h-6 text-yellow-500" />
                        <h2 className="text-2xl font-black">Achievements</h2>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {userStats.earnedBadges.map(badge => (
                            <BadgeCard key={badge.id} badge={badge} earned={true} />
                        ))}
                    </div>

                    {/* Next Badge Progress */}
                    {userStats.nextBadge && (
                        <div className="mt-6 p-4 rounded-xl bg-slate-800/50 border border-white/5">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-gray-400">Next: {userStats.nextBadge.badge.name}</span>
                                <span className="text-sm font-bold text-blue-400">{userStats.nextBadge.remaining} more</span>
                            </div>
                            <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                                    style={{ width: `${userStats.nextBadge.progress}%` }}
                                ></div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Activity Summary */}
                <div className="p-6 rounded-2xl bg-slate-900/50 border border-white/10 backdrop-blur-xl">
                    <h2 className="text-2xl font-black mb-4">Activity Summary</h2>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between py-2 border-b border-white/5">
                            <span className="text-gray-400">Member Since:</span>
                            <span className="font-mono">{new Date(user.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-white/5">
                            <span className="text-gray-400">Total Reports:</span>
                            <span className="font-bold text-blue-400">{userStats.totalReports}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-white/5">
                            <span className="text-gray-400">Verifications Given:</span>
                            <span className="font-bold text-green-400">{userStats.verified}</span>
                        </div>
                        <div className="flex justify-between py-2">
                            <span className="text-gray-400">Trust Score:</span>
                            <span className="font-bold text-purple-400">{user.reputation}/100</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ icon: Icon, label, value, color }) => {
    const colorClasses = {
        blue: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30 text-blue-400',
        green: 'from-green-500/20 to-emerald-500/20 border-green-500/30 text-green-400',
        purple: 'from-purple-500/20 to-pink-500/20 border-purple-500/30 text-purple-400'
    };

    return (
        <div className={`p-6 rounded-2xl bg-gradient-to-br ${colorClasses[color]} border backdrop-blur-xl`}>
            <div className="flex items-center justify-between mb-3">
                <Icon className="w-8 h-8" />
                <div className="text-3xl font-black">{value}</div>
            </div>
            <div className="text-xs font-bold uppercase tracking-wider opacity-80">{label}</div>
        </div>
    );
};

const BadgeCard = ({ badge, earned }) => (
    <div className={`p-4 rounded-xl border backdrop-blur-xl transition-all ${earned
            ? 'bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/30'
            : 'bg-slate-800/30 border-white/5 opacity-50'
        }`}>
        <div className="text-4xl text-center mb-2">{badge.icon}</div>
        <div className="text-sm font-bold text-center mb-1">{badge.name}</div>
        <div className="text-xs text-gray-500 text-center">{badge.description}</div>
    </div>
);

export default ProfilePage;

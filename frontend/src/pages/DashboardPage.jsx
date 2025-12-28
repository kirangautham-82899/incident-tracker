import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    BarChart3, User, Shield, Sparkles, MapPin,
    AlertCircle, Activity, Zap, CheckCircle, Clock,
    FileText, Share2
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import IncidentList from '../components/incident/IncidentList';
import LiveChat from '../components/common/LiveChat';
import useIncidentStore from '../stores/incidentStore';
import useAuthStore from '../stores/authStore';
import SafetyCheck from '../components/common/SafetyCheck';

const DashboardPage = () => {
    const { incidents, fetchIncidents } = useIncidentStore();
    const { user, isAuthenticated } = useAuthStore();
    const [currentTime, setCurrentTime] = useState(new Date());
    const [stats, setStats] = useState({ total: 0, active: 0, resolved: 0, critical: 0 });

    useEffect(() => {
        fetchIncidents();
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (incidents.length > 0) {
            setStats({
                total: incidents.length,
                active: incidents.filter(i => i.status === 'reported' || i.status === 'in-progress').length,
                resolved: incidents.filter(i => i.status === 'resolved').length,
                critical: incidents.filter(i => i.severity === 'critical' || i.severity === 'high').length
            });
        }
    }, [incidents]);

    const quickActions = [
        { title: 'New Incident', icon: AlertCircle, link: '/report', color: 'text-red-400', hover: 'hover:border-red-500/50 hover:bg-red-500/10' },
        { title: 'Analytics', icon: BarChart3, link: '/analytics', color: 'text-blue-400', hover: 'hover:border-blue-500/50 hover:bg-blue-500/10' },
        { title: 'Live Map', icon: MapPin, link: '/map', color: 'text-emerald-400', hover: 'hover:border-emerald-500/50 hover:bg-emerald-500/10' },
        { title: 'Export Status', icon: FileText, action: 'export', color: 'text-cyan-400', hover: 'hover:border-cyan-500/50 hover:bg-cyan-500/10' },
        { title: 'Share Intel', icon: Share2, action: 'share', color: 'text-pink-400', hover: 'hover:border-pink-500/50 hover:bg-pink-500/10' },
        { title: 'Profile', icon: User, link: '/profile', color: 'text-purple-400', requiresAuth: true, hover: 'hover:border-purple-500/50 hover:bg-purple-500/10' },
        { title: 'Dispatch', icon: Shield, link: '/admin', color: 'text-amber-400', requiresAuth: true, adminOnly: true, hover: 'hover:border-amber-500/50 hover:bg-amber-500/10' }
    ];

    const handleAction = (action) => {
        if (action === 'export') {
            import('../utils/pdfGenerator').then(module => {
                module.generateDashboardPDF(stats, incidents);
            });
        } else if (action === 'share') {
            const shareText = `Command Center Status: Active | ${stats.active} Incidents Managed`;
            if (navigator.share) {
                navigator.share({
                    title: 'Command Center Status',
                    text: shareText,
                    url: window.location.href
                }).catch(console.error);
            } else {
                navigator.clipboard.writeText(window.location.href);
                // Ideally show a toast here, but for now console log or alert
                alert('Dashboard Link Copied to Clipboard');
            }
        }
    };

    return (
        <div className="min-h-screen bg-[#050b14] text-slate-300 font-sans selection:bg-blue-500/30 overflow-hidden relative">
            <Navbar />

            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-[120px]" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
            </div>

            <div className="relative pt-24 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto pb-12">

                {/* HUD Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 border-b border-white/5 pb-6">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <div className="flex items-center gap-2 px-2 py-1 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-mono tracking-widest uppercase">
                                <span className="relative flex h-1.5 w-1.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-500"></span>
                                </span>
                                System Online
                            </div>
                            <span className="text-xs font-mono text-slate-500">
                                {currentTime.toLocaleDateString()}
                            </span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
                            Command<span className="text-slate-600">Center</span>
                        </h1>
                    </div>

                    {/* Live Clock & Stats Ticker */}
                    <div className="flex items-center gap-6">
                        <div className="text-right hidden md:block">
                            <div className="text-2xl font-mono font-bold text-white tracking-widest leading-none">
                                {currentTime.toLocaleTimeString([], { hour12: false })}
                            </div>
                            <div className="text-[10px] text-slate-500 uppercase tracking-widest">Local Time</div>
                        </div>

                        <div className="h-8 w-px bg-white/10 hidden md:block" />

                        <div className="flex gap-4">
                            <StatsWidget label="Active" value={stats.active} color="text-blue-400" />
                            <StatsWidget label="Critical" value={stats.critical} color="text-red-400" />
                            <StatsWidget label="Resolved" value={stats.resolved} color="text-emerald-400" />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* Main Feed (Left) */}
                    <div className="lg:col-span-9 space-y-6">
                        <div className="rounded-xl border border-white/5 bg-slate-900/20 backdrop-blur-sm overflow-hidden h-full min-h-[500px]">
                            <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
                                <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                                    <Activity className="w-4 h-4 text-slate-400" />
                                    Live Incident Feed
                                </h2>
                                <span className="text-[10px] font-mono text-slate-500">REAL-TIME WEBSOCKET</span>
                            </div>
                            <div className="p-1">
                                <IncidentList />
                            </div>
                        </div>
                    </div>

                    {/* Side Panel (Right) */}
                    <div className="lg:col-span-3 space-y-6">

                        {/* Safety Check Feature */}
                        <SafetyCheck className="w-full" />

                        {/* Quick Actions Grid */}
                        <div className="grid grid-cols-1 gap-2">
                            {quickActions.map((action, idx) => {
                                if (action.adminOnly && user?.role !== 'admin' && user?.role !== 'responder') return null;
                                if (action.requiresAuth && !isAuthenticated) return null;

                                const commonClasses = `group flex items-center gap-4 p-3 rounded-lg border border-white/5 bg-slate-900/40 transition-all duration-300 ${action.hover} w-full text-left`;
                                const Icon = action.icon;

                                if (action.action) {
                                    return (
                                        <button
                                            key={idx}
                                            onClick={() => handleAction(action.action)}
                                            className={commonClasses}
                                        >
                                            <div className={`p-2 rounded bg-white/5 group-hover:bg-transparent transition-colors`}>
                                                <Icon className={`w-5 h-5 ${action.color}`} />
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-slate-200 group-hover:text-white">{action.title}</div>
                                            </div>
                                        </button>
                                    );
                                }

                                return (
                                    <Link
                                        key={idx}
                                        to={action.link}
                                        className={commonClasses}
                                    >
                                        <div className={`p-2 rounded bg-white/5 group-hover:bg-transparent transition-colors`}>
                                            <Icon className={`w-5 h-5 ${action.color}`} />
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-slate-200 group-hover:text-white">{action.title}</div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>

                        {/* AI Sentinel Mini-Panel */}
                        <div className="rounded-xl border border-purple-500/20 bg-purple-900/5 p-4 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-2 opacity-50">
                                <Sparkles className="w-12 h-12 text-purple-500/10" />
                            </div>
                            <h3 className="text-xs font-bold text-purple-300 uppercase tracking-widest mb-2 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                                AI Sentinel
                            </h3>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-slate-400">Analysis Mode</span>
                                    <span className="font-mono text-purple-200">ACTIVE</span>
                                </div>
                                <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full w-[85%] bg-purple-500/50 rounded-full" />
                                </div>
                                <p className="text-[10px] text-slate-500 leading-relaxed pt-1">
                                    Scanning incoming reports for urgency patterns.
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <LiveChat />
        </div>
    );
};

const StatsWidget = ({ label, value, color }) => (
    <div className="flex flex-col items-center justify-center min-w-[70px] p-2 rounded bg-white/5 border border-white/5">
        <span className={`text-xl font-bold font-mono ${color}`}>{value}</span>
        <span className="text-[9px] text-slate-500 uppercase tracking-wider">{label}</span>
    </div>
);

export default DashboardPage;

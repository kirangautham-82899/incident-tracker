import React, { useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import DispatchConsole from '../../components/admin/DispatchConsole';
import { Shield, Radio, Activity, Users, Lock, LogOut } from 'lucide-react';

const AdminDashboardPage = () => {
    const [activeTab, setActiveTab] = useState('dispatch');

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans relative overflow-hidden">
            {/* Background Grid & Ambience */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.05]"></div>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[100px]" />
            </div>

            <Navbar />

            <div className="pt-24 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto h-[calc(100vh-20px)] flex flex-col">

                {/* Dashboard Header */}
                <div className="flex items-end justify-between mb-6 border-b border-white/10 pb-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="px-2 py-0.5 rounded bg-blue-500/20 border border-blue-500/30 text-blue-400 text-[10px] font-mono tracking-widest uppercase">
                                Restricted Access
                            </div>
                            <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                </span>
                                SYSTEM ONLINE
                            </div>
                        </div>
                        <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
                            <Shield className="w-8 h-8 text-blue-500" />
                            COMMAND <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">DISPATCH</span>
                        </h1>
                    </div>

                    <div className="flex gap-4">
                        <div className="hidden md:flex gap-8 px-6 py-2 bg-slate-900/50 border border-white/5 rounded-full items-center">
                            <div className="text-center">
                                <div className="text-[10px] text-gray-500 font-mono uppercase tracking-wider">Active Units</div>
                                <div className="text-xl font-bold text-white leading-none">12</div>
                            </div>
                            <div className="w-px h-8 bg-white/10"></div>
                            <div className="text-center">
                                <div className="text-[10px] text-gray-500 font-mono uppercase tracking-wider">Pending Tasks</div>
                                <div className="text-xl font-bold text-orange-500 leading-none">05</div>
                            </div>
                            <div className="w-px h-8 bg-white/10"></div>
                            <div className="text-center">
                                <div className="text-[10px] text-gray-500 font-mono uppercase tracking-wider">Coverage</div>
                                <div className="text-xl font-bold text-emerald-500 leading-none">94%</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden pb-6">
                    {/* Mobile Navigation (Horizontal Scroll) */}
                    <div className="lg:hidden flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
                        <MobileNavButton active={activeTab === 'dispatch'} onClick={() => setActiveTab('dispatch')} icon={Radio} label="Dispatch" />
                        <MobileNavButton active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} icon={Activity} label="Analytics" />
                        <MobileNavButton active={activeTab === 'units'} onClick={() => setActiveTab('units')} icon={Users} label="Units" />
                    </div>

                    {/* Desktop Sidebar Navigation */}
                    <div className="w-64 hidden lg:flex flex-col gap-2">
                        <NavButton
                            active={activeTab === 'dispatch'}
                            onClick={() => setActiveTab('dispatch')}
                            icon={Radio}
                            label="Dispatch Console"
                            desc="Incident Management"
                        />
                        <NavButton
                            active={activeTab === 'analytics'}
                            onClick={() => setActiveTab('analytics')}
                            icon={Activity}
                            label="System Analytics"
                            desc="Performance Metrics"
                        />
                        <NavButton
                            active={activeTab === 'units'}
                            onClick={() => setActiveTab('units')}
                            icon={Users}
                            label="Unit Management"
                            desc="Responder Tracking"
                        />
                        <div className="mt-auto">
                            <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20">
                                <div className="flex items-center gap-2 text-red-400 mb-2">
                                    <Lock className="w-4 h-4" />
                                    <span className="text-xs font-bold uppercase tracking-wider">Security Level 5</span>
                                </div>
                                <div className="text-[10px] text-gray-500 font-mono leading-relaxed">
                                    Authorized personnel only. All actions are logged and audited.
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content Panel */}
                    <div className="flex-1 bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden relative flex flex-col">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[80px] pointer-events-none"></div>

                        {activeTab === 'dispatch' && <DispatchConsole />}
                        {activeTab !== 'dispatch' && (
                            <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                                <Lock className="w-16 h-16 mb-4 opacity-20" />
                                <h3 className="text-xl font-bold text-gray-400">Module Locked</h3>
                                <p className="text-sm font-mono mt-2">Initialize Dispatch Console First</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const NavButton = ({ active, onClick, icon: Icon, label, desc }) => (
    <button
        onClick={onClick}
        className={`text-left p-4 rounded-xl transition-all duration-300 group border ${active
            ? 'bg-blue-600/10 border-blue-500/50 shadow-[0_0_20px_-5px_rgba(37,99,235,0.3)]'
            : 'bg-transparent border-transparent hover:bg-white/5 hover:border-white/10'
            }`}
    >
        <div className="flex items-center gap-3 mb-1">
            <Icon className={`w-5 h-5 ${active ? 'text-blue-400' : 'text-gray-500 group-hover:text-gray-300'}`} />
            <span className={`font-bold ${active ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>{label}</span>
        </div>
        <div className={`text-xs font-mono ml-8 ${active ? 'text-blue-300/70' : 'text-gray-600 group-hover:text-gray-500'}`}>
            {desc}
        </div>
    </button>
);

const MobileNavButton = ({ active, onClick, icon: Icon, label }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all whitespace-nowrap ${active
            ? 'bg-blue-600/20 border-blue-500 text-blue-400'
            : 'bg-white/5 border-white/10 text-gray-400'
            }`}
    >
        <Icon className="w-4 h-4" />
        <span className="text-sm font-bold">{label}</span>
    </button>
);

export default AdminDashboardPage;

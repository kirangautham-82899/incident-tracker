import React, { useEffect, useState } from 'react';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Activity, AlertCircle, CheckCircle, Clock, BarChart3 } from 'lucide-react';
import useIncidentStore from '../stores/incidentStore';
import Navbar from '../components/layout/Navbar';

const AnalyticsPage = () => {
    const { incidents, fetchIncidents } = useIncidentStore();
    const [analytics, setAnalytics] = useState({
        typeDistribution: [],
        statusDistribution: [],
        trendsData: [],
        stats: {
            total: 0,
            verified: 0,
            inProgress: 0,
            resolved: 0,
            avgResponseTime: 0
        }
    });

    useEffect(() => {
        fetchIncidents();
    }, []);

    useEffect(() => {
        if (incidents.length === 0) return;

        // Type Distribution
        const typeCounts = {};
        incidents.forEach(inc => {
            typeCounts[inc.type] = (typeCounts[inc.type] || 0) + 1;
        });
        const typeDistribution = Object.entries(typeCounts).map(([type, count]) => ({
            name: type.charAt(0).toUpperCase() + type.slice(1),
            value: count
        }));

        // Status Distribution
        const statusCounts = {};
        incidents.forEach(inc => {
            statusCounts[inc.status] = (statusCounts[inc.status] || 0) + 1;
        });
        const statusDistribution = Object.entries(statusCounts).map(([status, count]) => ({
            name: status.charAt(0).toUpperCase() + status.slice(1),
            value: count
        }));

        // Trends (Last 7 Days)
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dayStart = new Date(date.setHours(0, 0, 0, 0));
            const dayEnd = new Date(date.setHours(23, 59, 59, 999));

            const dayIncidents = incidents.filter(inc => {
                const incDate = new Date(inc.createdAt);
                return incDate >= dayStart && incDate <= dayEnd;
            });

            last7Days.push({
                date: dayStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                incidents: dayIncidents.length,
                verified: dayIncidents.filter(inc => inc.verificationCount > 0).length
            });
        }

        // Calculate Stats
        const verified = incidents.filter(inc => inc.verificationCount > 0).length;
        const inProgress = incidents.filter(inc => inc.status === 'in-progress').length;
        const resolved = incidents.filter(inc => inc.status === 'resolved').length;

        // Calculate avg response time (for resolved incidents)
        const resolvedIncidents = incidents.filter(inc => inc.resolvedAt);
        const avgResponseTime = resolvedIncidents.length > 0
            ? resolvedIncidents.reduce((sum, inc) => {
                const responseTime = (new Date(inc.resolvedAt) - new Date(inc.createdAt)) / (1000 * 60 * 60); // hours
                return sum + responseTime;
            }, 0) / resolvedIncidents.length
            : 0;

        setAnalytics({
            typeDistribution,
            statusDistribution,
            trendsData: last7Days,
            stats: {
                total: incidents.length,
                verified,
                inProgress,
                resolved,
                avgResponseTime: avgResponseTime.toFixed(1)
            }
        });
    }, [incidents]);

    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

    return (
        <div className="min-h-screen bg-slate-950 text-white">
            {/* Background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.05]"></div>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>
            </div>

            <Navbar />

            <div className="pt-24 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto">
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <BarChart3 className="w-10 h-10 text-blue-500" />
                        <h1 className="text-4xl font-black tracking-tight">
                            SYSTEM <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">ANALYTICS</span>
                        </h1>
                    </div>
                    <p className="text-gray-500 font-mono text-sm">Real-time incident monitoring and statistical analysis</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        icon={Activity}
                        label="Total Incidents"
                        value={analytics.stats.total}
                        color="blue"
                    />
                    <StatCard
                        icon={CheckCircle}
                        label="Verified"
                        value={analytics.stats.verified}
                        color="green"
                    />
                    <StatCard
                        icon={AlertCircle}
                        label="In Progress"
                        value={analytics.stats.inProgress}
                        color="yellow"
                    />
                    <StatCard
                        icon={Clock}
                        label="Avg Response Time"
                        value={`${analytics.stats.avgResponseTime}h`}
                        color="purple"
                    />
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Trends Chart */}
                    <ChartCard title="Incident Trends (Last 7 Days)">
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={analytics.trendsData}>
                                <defs>
                                    <linearGradient id="colorIncidents" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                                <XAxis dataKey="date" stroke="#94a3b8" style={{ fontSize: 12 }} />
                                <YAxis stroke="#94a3b8" style={{ fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                                    labelStyle={{ color: '#fff' }}
                                />
                                <Legend wrapperStyle={{ color: '#94a3b8' }} />
                                <Area type="monotone" dataKey="incidents" stroke="#3b82f6" fillOpacity={1} fill="url(#colorIncidents)" />
                                <Area type="monotone" dataKey="verified" stroke="#10b981" fillOpacity={0.5} fill="#10b98130" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </ChartCard>

                    {/* Type Distribution */}
                    <ChartCard title="Incident Type Distribution">
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={analytics.typeDistribution}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {analytics.typeDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </ChartCard>

                    {/* Status Distribution */}
                    <ChartCard title="Status Distribution">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={analytics.statusDistribution}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                                <XAxis dataKey="name" stroke="#94a3b8" style={{ fontSize: 12 }} />
                                <YAxis stroke="#94a3b8" style={{ fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                                />
                                <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartCard>

                    {/* Priority Distribution */}
                    <ChartCard title="Priority Score Distribution">
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={analytics.trendsData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                                <XAxis dataKey="date" stroke="#94a3b8" style={{ fontSize: 12 }} />
                                <YAxis stroke="#94a3b8" style={{ fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                                />
                                <Legend />
                                <Line type="monotone" dataKey="incidents" stroke="#8b5cf6" strokeWidth={2} />
                                <Line type="monotone" dataKey="verified" stroke="#10b981" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </ChartCard>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ icon: Icon, label, value, color }) => {
    const colorClasses = {
        blue: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30 text-blue-400',
        green: 'from-green-500/20 to-emerald-500/20 border-green-500/30 text-green-400',
        yellow: 'from-yellow-500/20 to-orange-500/20 border-yellow-500/30 text-yellow-400',
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

const ChartCard = ({ title, children }) => (
    <div className="p-6 rounded-2xl bg-slate-900/50 border border-white/10 backdrop-blur-xl">
        <h3 className="text-lg font-bold mb-4 text-white">{title}</h3>
        {children}
    </div>
);

export default AnalyticsPage;

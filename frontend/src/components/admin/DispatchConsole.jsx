import React, { useEffect, useState } from 'react';
import useIncidentStore from '../../stores/incidentStore';
import { Play, CheckCircle, AlertTriangle, MapPin, Clock, Search, Filter, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

const DispatchConsole = () => {
    const { incidents, fetchIncidents, updateIncidentStatus } = useIncidentStore();
    const [filter, setFilter] = useState('all'); // show all by default for easier debugging

    useEffect(() => {
        fetchIncidents();
    }, []);

    const handleDispatch = async (incident) => {
        const loadingId = toast.loading("Initializing Dispatch Protocol...", {
            style: { background: '#1e293b', color: '#fff', border: '1px solid #3b82f6' }
        });

        try {
            const result = await updateIncidentStatus(incident._id, 'in-progress');

            if (result.success) {
                toast.success(`Unit Assigned to Sector ${incident._id.slice(-4).toUpperCase()}`, {
                    id: loadingId,
                    icon: '🚔',
                    style: { background: '#064e3b', color: '#fff' }
                });
            } else {
                toast.error(result.error, { id: loadingId });
            }
        } catch (error) {
            toast.error("Dispatch Failed", { id: loadingId });
        }
    };

    // Filter logic
    const filteredIncidents = incidents.filter(inc => {
        if (filter === 'all') return true;
        // Fix: Show verified if status matches OR if it has verifications (since auto-verify isn't active yet)
        if (filter === 'verified') return inc.status === 'verified' || inc.verificationCount > 0;
        if (filter === 'pending') return inc.status === 'reported' && inc.verificationCount === 0;
        return inc.status === filter;
    });

    return (
        <div className="h-full flex flex-col p-6">
            {/* Console Toolbar */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search ticket ID..."
                            className="bg-slate-800 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:border-blue-500 outline-none w-64 font-mono"
                        />
                    </div>
                    <div className="flex items-center gap-2 bg-slate-800 p-1 rounded-lg border border-white/10">
                        <button
                            onClick={() => setFilter('verified')}
                            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${filter === 'verified' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                        >
                            VERIFIED
                        </button>
                        <button
                            onClick={() => setFilter('reported')}
                            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${filter === 'reported' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                        >
                            PENDING
                        </button>
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${filter === 'all' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                        >
                            ALL LOGS
                        </button>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-gray-500 text-xs font-mono">
                    <Filter className="w-4 h-4" />
                    <span>SORT: PRIORITY DESC</span>
                </div>
            </div>

            {/* Data Grid */}
            <div className="flex-1 overflow-auto rounded-xl border border-white/5 bg-slate-900/50">
                <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 bg-slate-900 z-10">
                        <tr>
                            <th className="p-4 text-xs font-mono text-gray-500 border-b border-white/10">ID / TIME</th>
                            <th className="p-4 text-xs font-mono text-gray-500 border-b border-white/10">TYPE</th>
                            <th className="p-4 text-xs font-mono text-gray-500 border-b border-white/10">LOCATION</th>
                            <th className="p-4 text-xs font-mono text-gray-500 border-b border-white/10">SEVERITY</th>
                            <th className="p-4 text-xs font-mono text-gray-500 border-b border-white/10">TRUST SCORE</th>
                            <th className="p-4 text-xs font-mono text-gray-500 border-b border-white/10 text-right">ACTION</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filteredIncidents.map((incident) => (
                            <tr key={incident._id} className="hover:bg-white/5 transition-colors group">
                                <td className="p-4">
                                    <div className="font-mono text-xs text-blue-400">#{incident._id.slice(-6).toUpperCase()}</div>
                                    <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                        <Clock className="w-3 h-3" />
                                        {new Date(incident.createdAt).toLocaleTimeString()}
                                    </div>
                                </td>
                                <td className="p-4">
                                    <span className="inline-flex items-center gap-2 px-2 py-1 rounded-md bg-white/5 border border-white/10 text-xs font-bold uppercase text-gray-300">
                                        {incident.type}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-start gap-2 max-w-[200px]">
                                        <MapPin className="w-3 h-3 text-gray-500 mt-1 shrink-0" />
                                        <span className="text-sm text-gray-300 truncate">{incident.location?.address || "Unknown Sector"}</span>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${incident.priority > 10 ? 'bg-red-500 animate-pulse' : 'bg-yellow-500'}`}></div>
                                        <span className="text-sm font-mono text-gray-400">{incident.priority || 0}</span>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-1 text-emerald-400">
                                        <ShieldCheck className="w-4 h-4" />
                                        <span className="font-bold">{incident.verificationCount || 0}</span>
                                    </div>
                                </td>
                                <td className="p-4 text-right">
                                    <button
                                        onClick={() => handleDispatch(incident)}
                                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-all shadow-[0_0_15px_-3px_rgba(37,99,235,0.4)] group-hover:scale-105"
                                    >
                                        <Play className="w-3 h-3 fill-current" />
                                        DISPATCH
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filteredIncidents.length === 0 && (
                    <div className="p-12 text-center text-gray-500 font-mono text-sm">
                        NO ACTIVE RECORDS FOUND IN BUFFER
                    </div>
                )}
            </div>
        </div>
    );
};

export default DispatchConsole;

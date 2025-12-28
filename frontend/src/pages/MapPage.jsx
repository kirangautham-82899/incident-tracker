import React from 'react';
import { Map } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import IncidentMap from '../components/map/IncidentMap';
import useIncidentStore from '../stores/incidentStore';

const MapPage = () => {
    const { incidents } = useIncidentStore();

    return (
        <div className="min-h-screen bg-slate-950 text-white">
            <Navbar />

            {/* Background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.05]"></div>
            </div>

            <div className="relative pt-24 px-4 sm:px-6 lg:px-8 max-w-[1800px] mx-auto pb-8">
                <div className="mb-6">
                    <div className="flex items-center gap-3 mb-2">
                        <Map className="w-8 h-8 text-blue-500" />
                        <h1 className="text-4xl font-black tracking-tight">
                            INCIDENT <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">MAP</span>
                        </h1>
                    </div>
                    <p className="text-gray-500 font-mono text-sm">Geographic visualization with clustering and heat map overlay</p>
                </div>

                {/* Map Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="p-4 rounded-xl bg-slate-900/50 border border-white/10 backdrop-blur-xl">
                        <div className="text-2xl font-black text-blue-400">{incidents.length}</div>
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Incidents</div>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-900/50 border border-white/10 backdrop-blur-xl">
                        <div className="text-2xl font-black text-green-400">
                            {incidents.filter(i => i.status === 'resolved').length}
                        </div>
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Resolved</div>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-900/50 border border-white/10 backdrop-blur-xl">
                        <div className="text-2xl font-black text-orange-400">
                            {incidents.filter(i => i.severity === 'critical' || i.severity === 'high').length}
                        </div>
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">High Priority</div>
                    </div>
                </div>

                {/* Map Container */}
                <div className="h-[calc(100vh-350px)] min-h-[500px]">
                    <IncidentMap incidents={incidents} />
                </div>

                {/* Legend */}
                <div className="mt-6 p-6 rounded-2xl bg-slate-900/50 border border-white/10 backdrop-blur-xl">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Map Legend</h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {[
                            { type: 'Fire', color: '#f97316' },
                            { type: 'Medical', color: '#3b82f6' },
                            { type: 'Accident', color: '#ef4444' },
                            { type: 'Infrastructure', color: '#8b5cf6' },
                            { type: 'Safety', color: '#eab308' }
                        ].map(item => (
                            <div key={item.type} className="flex items-center gap-2">
                                <div
                                    className="w-4 h-4 rounded-full border-2 border-white shadow-lg"
                                    style={{ background: item.color }}
                                ></div>
                                <span className="text-sm text-gray-300">{item.type}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MapPage;

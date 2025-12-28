import React from 'react';
import { X, MapPin, Calendar, User, Shield, TrendingUp } from 'lucide-react';

const IncidentDetailModal = ({ incident, isOpen, onClose }) => {
    if (!isOpen || !incident) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="relative w-full max-w-2xl bg-slate-900 rounded-xl border border-white/10 shadow-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-slate-900 border-b border-white/10 p-6 flex items-start justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${incident.severity === 'critical' ? 'bg-red-500/20 text-red-400' :
                                    incident.severity === 'high' ? 'bg-orange-500/20 text-orange-400' :
                                        'bg-yellow-500/20 text-yellow-400'
                                }`}>
                                {incident.severity?.toUpperCase()}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-xs font-mono ${incident.status === 'resolved' ? 'bg-green-500/20 text-green-400' :
                                    'bg-blue-500/20 text-blue-400'
                                }`}>
                                {incident.status?.toUpperCase()}
                            </span>
                        </div>
                        <h2 className="text-2xl font-bold text-white">{incident.title}</h2>
                        <p className="text-sm text-gray-400 mt-1">ID: #{incident._id?.slice(-8).toUpperCase()}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Description */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-400 mb-2">Description</h3>
                        <p className="text-gray-300 leading-relaxed">{incident.description}</p>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-800/50 rounded-lg p-4 border border-white/5">
                            <div className="flex items-center gap-2 text-gray-400 mb-1">
                                <MapPin className="w-4 h-4" />
                                <span className="text-xs font-semibold">Location</span>
                            </div>
                            <p className="text-sm text-white">{incident.location?.address || 'Unknown'}</p>
                        </div>

                        <div className="bg-slate-800/50 rounded-lg p-4 border border-white/5">
                            <div className="flex items-center gap-2 text-gray-400 mb-1">
                                <Calendar className="w-4 h-4" />
                                <span className="text-xs font-semibold">Reported</span>
                            </div>
                            <p className="text-sm text-white">
                                {new Date(incident.createdAt).toLocaleDateString()} {new Date(incident.createdAt).toLocaleTimeString()}
                            </p>
                        </div>

                        <div className="bg-slate-800/50 rounded-lg p-4 border border-white/5">
                            <div className="flex items-center gap-2 text-gray-400 mb-1">
                                <User className="w-4 h-4" />
                                <span className="text-xs font-semibold">Reporter</span>
                            </div>
                            <p className="text-sm text-white">{incident.reporter?.name || 'Anonymous'}</p>
                        </div>

                        <div className="bg-slate-800/50 rounded-lg p-4 border border-white/5">
                            <div className="flex items-center gap-2 text-gray-400 mb-1">
                                <TrendingUp className="w-4 h-4" />
                                <span className="text-xs font-semibold">Verifications</span>
                            </div>
                            <p className="text-sm text-white">{incident.verificationCount || 0} report(s)</p>
                        </div>
                    </div>

                    {/* Media */}
                    {incident.media && incident.media.length > 0 && (
                        <div>
                            <h3 className="text-sm font-semibold text-gray-400 mb-2">Media</h3>
                            <div className="grid grid-cols-2 gap-2">
                                {incident.media.map((item, idx) => (
                                    <img
                                        key={idx}
                                        src={item.url}
                                        alt="Incident media"
                                        className="w-full h-48 object-cover rounded-lg"
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-slate-900 border-t border-white/10 p-4">
                    <button
                        onClick={onClose}
                        className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default IncidentDetailModal;

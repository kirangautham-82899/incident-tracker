import React, { useState } from 'react';
import { MapPin, Clock, CheckCircle, AlertTriangle, User, Shield, AlertOctagon, Eye } from 'lucide-react';
import { formatRelativeTime, capitalize } from '../../utils/helpers';
import Button from '../common/Button';
import useAuthStore from '../../stores/authStore';
import IncidentDetailModal from './IncidentDetailModal';
import SocialShare from '../common/SocialShare';

const IncidentCard = ({ incident, onVerify }) => {
    const { isAuthenticated, user } = useAuthStore();
    const hasVerified = incident.verifications?.some(v => v.userId === user?._id);
    const [showDetails, setShowDetails] = useState(false);

    const getTypeStyles = (type) => {
        const styles = {
            accident: {
                color: 'text-red-400',
                bg: 'bg-red-500/10',
                border: 'border-red-500/20',
                icon: AlertOctagon
            },
            fire: {
                color: 'text-orange-400',
                bg: 'bg-orange-500/10',
                border: 'border-orange-500/20',
                icon: AlertTriangle
            },
            medical: {
                color: 'text-blue-400',
                bg: 'bg-blue-500/10',
                border: 'border-blue-500/20',
                icon: Shield
            },
            default: {
                color: 'text-gray-400',
                bg: 'bg-gray-500/10',
                border: 'border-gray-500/20',
                icon: AlertTriangle
            }
        };
        return styles[type] || styles.default;
    };

    const typeStyle = getTypeStyles(incident.type);
    const TypeIcon = typeStyle.icon;

    return (
        <div className="group relative bg-slate-800/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-slate-800/60 transition-all duration-300 hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.3)] hover:-translate-y-1 overflow-hidden">

            {/* Status Indicating Top Border */}
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${incident.severity === 'high' ? 'from-red-500 to-orange-500' :
                incident.severity === 'medium' ? 'from-orange-500 to-yellow-500' :
                    'from-blue-500 to-cyan-500'
                }`}></div>

            {/* Header Section */}
            <div className="flex justify-between items-start mb-4">
                <div className="flex gap-4">
                    <div className={`p-3 rounded-xl ${typeStyle.bg} ${typeStyle.color} border ${typeStyle.border}`}>
                        <TypeIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className={`text-xs font-bold uppercase tracking-wider ${incident.severity === 'critical' ? 'text-red-400 animate-pulse' :
                                incident.severity === 'high' ? 'text-orange-400' : 'text-blue-400'
                                }`}>
                                {incident.severity} Priority
                            </span>
                            <span className="text-slate-600 text-xs">•</span>
                            <span className="text-slate-400 text-xs font-mono">ID: #{incident._id.slice(-6).toUpperCase()}</span>
                        </div>
                        <h3 className="text-lg font-bold text-white leading-tight group-hover:text-blue-400 transition-colors">
                            {incident.title}
                        </h3>
                    </div>
                </div>

                <div className={`px-3 py-1 rounded-full text-xs font-mono border ${incident.status === 'resolved' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                    'bg-blue-500/10 text-blue-400 border-blue-500/20'
                    }`}>
                    {incident.status.toUpperCase()}
                </div>
            </div>

            {/* Content */}
            <p className="text-gray-400 text-sm leading-relaxed mb-6 pl-[60px]">
                {incident.description}
            </p>

            {/* Meta Data Grid */}
            <div className="grid grid-cols-2 gap-3 mb-6 pl-[60px]">
                <div className="flex items-center gap-2 text-xs text-gray-500 bg-slate-900/50 p-2 rounded-lg border border-white/5">
                    <MapPin className="w-4 h-4 text-blue-500" />
                    <span className="truncate">{incident.location?.address || 'Unknown Location'}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 bg-slate-900/50 p-2 rounded-lg border border-white/5">
                    <Clock className="w-4 h-4 text-purple-500" />
                    <span>{formatRelativeTime(incident.createdAt)}</span>
                </div>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-between pl-[60px] pt-4 border-t border-white/5">
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <User className="w-4 h-4" />
                    <span className="font-mono text-xs">Reported by {incident.reporter?.name || 'Anonymous'}</span>
                </div>

                <div className="flex items-center gap-2">
                    <SocialShare incident={incident} compact={true} />

                    <button
                        onClick={() => setShowDetails(true)}
                        className="px-3 py-1.5 bg-slate-700/50 hover:bg-slate-700 border border-white/10 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-2"
                    >
                        <Eye className="w-3 h-3" />
                        View Details
                    </button>

                    {isAuthenticated && !hasVerified && (
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => onVerify(incident._id)}
                            className="flex items-center gap-2 px-3 py-1.5 bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 text-green-400 rounded-lg text-xs font-bold transition-all shadow-[0_0_10px_-3px_rgba(34,197,94,0.3)]"
                        >
                            <CheckCircle className="w-3 h-3" />
                            Verify ({incident.verificationCount || 0})
                        </Button>
                    )}

                    {hasVerified && (
                        <span className="px-3 py-1.5 bg-green-500/10 text-green-400 border border-green-500/20 rounded-lg text-xs font-bold flex items-center gap-2">
                            <CheckCircle className="w-3 h-3" />
                            Verified ({incident.verificationCount || 0})
                        </span>
                    )}
                </div>
            </div>

            {/* Detail Modal */}
            {showDetails && (
                <IncidentDetailModal
                    incident={incident}
                    onClose={() => setShowDetails(false)}
                />
            )}
        </div>
    );
};

export default IncidentCard;

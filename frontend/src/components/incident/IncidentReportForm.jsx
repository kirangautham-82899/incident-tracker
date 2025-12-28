import React, { useState, useEffect } from 'react';
import { MapPin, AlertCircle, Send, Terminal, RotateCcw, Lightbulb, Zap } from 'lucide-react';
import useIncidentStore from '../../stores/incidentStore';
import useAuthStore from '../../stores/authStore';
import { INCIDENT_TYPE_OPTIONS } from '../../utils/constants';
import { getCurrentLocation } from '../../utils/helpers';
import { analyzeUrgency, suggestIncidentType, generateInsights } from '../../utils/aiAnalysis';
import Input from '../common/Input';
import Button from '../common/Button';
import MediaUpload from '../common/MediaUpload';
import VoiceInput from '../common/VoiceInput';
import toast from 'react-hot-toast';

const IncidentReportForm = ({ onClose }) => {
    const { isAuthenticated, user } = useAuthStore();
    const { createIncident, isLoading } = useIncidentStore();

    const [formData, setFormData] = useState({
        type: '',
        title: '',
        description: '',
        location: {
            coordinates: [],
            address: ''
        },
        reporter: {
            name: user?.name || '',
            contact: ''
        },
        media: []
    });

    const [isGettingLocation, setIsGettingLocation] = useState(false);
    const [aiInsights, setAiInsights] = useState(null);

    // AI Analysis - Analyze description as user types
    useEffect(() => {
        if (formData.description.length > 20) {
            const insights = generateInsights({
                ...formData,
                createdAt: new Date(),
                verificationCount: 0
            });
            setAiInsights(insights);
        } else {
            setAiInsights(null);
        }
    }, [formData.description, formData.type]);

    const handleMediaUpload = (uploadedMedia) => {
        setFormData({ ...formData, media: uploadedMedia });
        toast.success('Media attached successfully!');
    };

    // FAKE DATA SIMULATOR FUNCTION
    const simulateData = () => {
        const types = ['accident', 'fire', 'medical', 'infrastructure', 'safety'];
        const randomType = types[Math.floor(Math.random() * types.length)];

        const titles = {
            accident: "Multi-vehicle collision on Main St",
            fire: "Smoke visible from apartment complex",
            medical: "Pedestrian injured, requires ambulance",
            infrastructure: "Large pothole causing traffic hazard",
            safety: "Suspicious activity near park entrance"
        };

        const descriptions = {
            accident: "Two cars involved, blocking the left lane. Police are already on scene but traffic is backing up.",
            fire: "Dark smoke coming from the third floor. Alarms are sounding.",
            medical: "Person fell on the sidewalk, conscious but unable to move leg.",
            infrastructure: "Deep pothole in the center lane, potentially damaging vehicles.",
            safety: "Group of individuals loitering and harassing passersby."
        };

        const randomLat = 12.9716 + (Math.random() - 0.5) * 0.05; // Base around Bangalore roughly for demo
        const randomLng = 77.5946 + (Math.random() - 0.5) * 0.05;

        setFormData({
            type: randomType,
            title: titles[randomType],
            description: descriptions[randomType],
            location: {
                coordinates: [randomLng, randomLat],
                address: "Detected via Simulation Protocol"
            },
            reporter: {
                name: user?.name || "Test Unit Alpha",
                contact: "test-unit@incident.com"
            },
            media: []
        });
        toast.success("Simulation Data Loaded");
    };

    const handleGetLocation = async () => {
        setIsGettingLocation(true);
        try {
            const position = await getCurrentLocation();
            setFormData({
                ...formData,
                location: {
                    ...formData.location,
                    coordinates: [position.longitude, position.latitude]
                }
            });
            toast.success('Coordinates locked');
        } catch (error) {
            toast.error('GPS Signal Weak. Unable to lock coordinates.');
        } finally {
            setIsGettingLocation(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.location.coordinates.length !== 2) {
            toast.error('Location coordinates required for dispatch');
            return;
        }

        const result = await createIncident(formData);

        if (result.success) {
            toast.success('Incident transmitted to command center!');
            onClose();
        } else {
            toast.error(result.error || 'Transmission failed');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">

            {/* Header / Simulator */}
            <div className="flex justify-between items-center mb-6">
                <div className="text-xs font-mono text-gray-500 uppercase tracking-widest">
                    // INPUT TERMINAL
                </div>
                <button
                    type="button"
                    onClick={simulateData}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono hover:bg-blue-500/20 transition-colors"
                >
                    <Terminal className="w-3 h-3" />
                    SIMULATE_DATA
                </button>
            </div>

            {/* Incident Type */}
            <div>
                <label className="block text-xs font-bold text-blue-400 uppercase tracking-wider mb-3">
                    Incident Classification
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {INCIDENT_TYPE_OPTIONS.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => setFormData({ ...formData, type: option.value })}
                            className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden group ${formData.type === option.value
                                ? 'bg-blue-600/20 border-blue-500 shadow-[0_0_15px_-3px_rgba(37,99,235,0.4)]'
                                : 'bg-slate-900/50 border-white/10 hover:border-white/20 hover:bg-slate-800/50'
                                }`}
                        >
                            <div className={`text-sm font-bold ${formData.type === option.value ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}>
                                {option.label}
                            </div>
                            {formData.type === option.value && (
                                <div className="absolute inset-0 bg-blue-400/5 animate-pulse"></div>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Media Upload Section */}
            <div>
                <label className="block text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">
                    📸 Attach Media (Optional)
                </label>
                <MediaUpload onUploadComplete={handleMediaUpload} maxFiles={5} />
                {formData.media.length > 0 && (
                    <div className="mt-2 text-xs text-green-400 font-mono">
                        ✓ {formData.media.length} file(s) attached
                    </div>
                )}
            </div>

            {/* Title */}
            <div>
                <label className="block text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">Subject</label>
                <input
                    type="text"
                    placeholder="Brief incident summary"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-950/50 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all font-mono"
                    required
                />
            </div>

            {/* Description */}
            <div>
                <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                        Detailed Report
                    </label>
                    <VoiceInput
                        onTranscript={(text) => setFormData(prev => ({
                            ...prev,
                            description: prev.description ? `${prev.description} ${text}` : text
                        }))}
                    />
                </div>
                <textarea
                    className="w-full px-4 py-3 bg-slate-950/50 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all font-mono min-h-[120px]"
                    placeholder="Provide sitrep details... (or use voice input)"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                />
            </div>

            {/* AI Insights Panel */}
            {aiInsights && (
                <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 space-y-2">
                    <div className="flex items-center gap-2 text-purple-400 mb-2">
                        <Zap className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">AI Analysis</span>
                    </div>
                    {aiInsights.insights.map((insight, idx) => (
                        <div key={idx} className="text-sm text-gray-300 font-mono flex items-start gap-2">
                            <span>•</span>
                            <span>{insight}</span>
                        </div>
                    ))}
                    {aiInsights.suggestedType && aiInsights.suggestedType !== formData.type && (
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, type: aiInsights.suggestedType })}
                            className="mt-2 px-3 py-1.5 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 rounded-lg text-purple-300 text-xs font-bold flex items-center gap-2 transition-all"
                        >
                            <Lightbulb className="w-3 h-3" />
                            Apply Suggested Type: {aiInsights.suggestedType}
                        </button>
                    )}
                    <div className="mt-2 text-xs text-gray-500 font-mono">
                        Urgency: <span className={`font-bold ${aiInsights.urgency === 'critical' ? 'text-red-400' :
                            aiInsights.urgency === 'high' ? 'text-orange-400' :
                                aiInsights.urgency === 'medium' ? 'text-yellow-400' :
                                    'text-gray-400'
                            }`}>{aiInsights.urgency.toUpperCase()}</span> |
                        Priority: <span className="text-blue-400 font-bold">{aiInsights.aiPriority}</span>
                    </div>
                </div>
            )}

            {/* Location */}
            <div className="space-y-3">
                <label className="block text-xs font-bold text-blue-400 uppercase tracking-wider">
                    Geospatial Data
                </label>

                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={handleGetLocation}
                        disabled={isGettingLocation}
                        className="flex-1 px-4 py-3 bg-slate-900 border border-white/10 rounded-xl text-gray-300 hover:text-white hover:border-blue-500/50 transition-all flex items-center justify-center gap-2 group"
                    >
                        <MapPin className={`w-4 h-4 ${isGettingLocation ? 'animate-bounce text-blue-500' : 'text-gray-500 group-hover:text-blue-500'}`} />
                        <span className="font-mono text-sm">
                            {isGettingLocation ? 'ACQUIRING SIGNAL...' :
                                formData.location.coordinates.length > 0 ? 'COORDINATES LOCKED' : 'DETECT LOCATION'}
                        </span>
                    </button>
                </div>

                {formData.location.coordinates.length > 0 && (
                    <div className="px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-lg text-xs font-mono text-blue-400">
                        LAT: {formData.location.coordinates[1].toFixed(6)} // LNG: {formData.location.coordinates[0].toFixed(6)}
                    </div>
                )}

                <input
                    type="text"
                    placeholder="Manual address entry (optional)"
                    value={formData.location.address}
                    onChange={(e) => setFormData({
                        ...formData,
                        location: { ...formData.location, address: e.target.value }
                    })}
                    className="w-full px-4 py-3 bg-slate-950/50 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all font-mono text-sm"
                />
            </div>

            {/* Reporter Info (if not authenticated) */}
            {!isAuthenticated && (
                <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                        <div className="flex-1 space-y-3">
                            <p className="text-xs text-yellow-500 font-bold uppercase tracking-wider">
                                Anonymous Reporting Mode Active
                            </p>
                            <input
                                type="text"
                                placeholder="Alias / Name (Optional)"
                                value={formData.reporter.name}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    reporter: { ...formData.reporter, name: e.target.value }
                                })}
                                className="w-full px-4 py-2 bg-slate-950/50 border border-white/10 rounded-lg text-white text-sm placeholder-gray-600 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none font-mono"
                            />
                            <input
                                type="text"
                                placeholder="Contact Vector (Optional)"
                                value={formData.reporter.contact}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    reporter: { ...formData.reporter, contact: e.target.value }
                                })}
                                className="w-full px-4 py-2 bg-slate-950/50 border border-white/10 rounded-lg text-white text-sm placeholder-gray-600 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none font-mono"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
                <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-6 py-4 bg-slate-800 hover:bg-slate-700 text-gray-300 font-bold rounded-xl transition-colors"
                >
                    ABORT
                </button>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-[2] px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98]"
                >
                    {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                        <>
                            <Send className="w-5 h-5" />
                            <span>TRANSMIT REPORT</span>
                        </>
                    )}
                </button>
            </div>
        </form>
    );
};

export default IncidentReportForm;

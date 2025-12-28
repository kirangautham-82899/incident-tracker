import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster';
import 'leaflet.heat';
import { X, MapPin, Clock, AlertCircle } from 'lucide-react';
import useIncidentStore from '../../stores/incidentStore';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const IncidentMap = ({ incidents, center = [20.5937, 78.9629], zoom = 5 }) => {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markerClusterRef = useRef(null);
    const heatLayerRef = useRef(null);
    const [selectedIncident, setSelectedIncident] = useState(null);
    const [showHeatMap, setShowHeatMap] = useState(false);

    // Custom marker icons by type
    const getMarkerIcon = (type, severity) => {
        const colors = {
            fire: '#f97316',
            medical: '#3b82f6',
            accident: '#ef4444',
            infrastructure: '#8b5cf6',
            safety: '#eab308',
            default: '#6b7280'
        };

        const color = colors[type] || colors.default;
        const size = severity === 'critical' ? 40 : severity === 'high' ? 35 : 30;

        return L.divIcon({
            html: `
                <div style="
                    position: relative;
                    width: ${size}px;
                    height: ${size}px;
                ">
                    <div style="
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        width: ${size}px;
                        height: ${size}px;
                        background: ${color};
                        border: 3px solid white;
                        border-radius: 50% 50% 50% 0;
                        transform: translate(-50%, -50%) rotate(-45deg);
                        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                        animation: pulse 2s ease-in-out infinite;
                    "></div>
                    <div style="
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        width: ${size * 0.4}px;
                        height: ${size * 0.4}px;
                        background: white;
                        border-radius: 50%;
                        z-index: 10;
                    "></div>
                </div>
                <style>
                    @keyframes pulse {
                        0%, 100% { opacity: 1; transform: translate(-50%, -50%) rotate(-45deg) scale(1); }
                        50% { opacity: 0.8; transform: translate(-50%, -50%) rotate(-45deg) scale(1.1); }
                    }
                </style>
            `,
            className: 'custom-marker',
            iconSize: [size, size],
            iconAnchor: [size / 2, size],
            popupAnchor: [0, -size]
        });
    };

    useEffect(() => {
        // Initialize map
        if (!mapInstanceRef.current && mapRef.current) {
            const map = L.map(mapRef.current, {
                zoomControl: true,
                scrollWheelZoom: true,
            }).setView(center, zoom);

            // Add tile layer
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                maxZoom: 19,
            }).addTo(map);

            mapInstanceRef.current = map;

            // Initialize marker cluster group
            markerClusterRef.current = L.markerClusterGroup({
                chunkedLoading: true,
                spiderfyOnMaxZoom: true,
                showCoverageOnHover: false,
                zoomToBoundsOnClick: true,
                iconCreateFunction: (cluster) => {
                    const count = cluster.getChildCount();
                    let size = 'small';
                    if (count > 10) size = 'large';
                    else if (count > 5) size = 'medium';

                    return L.divIcon({
                        html: `
                            <div style="
                                width: 40px;
                                height: 40px;
                                background: linear-gradient(135deg, #3b82f6, #8b5cf6);
                                border: 3px solid white;
                                border-radius: 50%;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                color: white;
                                font-weight: bold;
                                font-size: 14px;
                                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                            ">${count}</div>
                        `,
                        className: 'marker-cluster',
                        iconSize: L.point(40, 40)
                    });
                }
            });

            map.addLayer(markerClusterRef.current);
        }

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, []);

    // Update markers when incidents change
    useEffect(() => {
        if (!mapInstanceRef.current || !incidents) return;

        // Clear existing markers
        if (markerClusterRef.current) {
            markerClusterRef.current.clearLayers();
        }

        // Add new markers
        const validIncidents = incidents.filter(inc =>
            inc.location?.coordinates &&
            inc.location.coordinates.length === 2 &&
            !isNaN(inc.location.coordinates[0]) &&
            !isNaN(inc.location.coordinates[1])
        );

        validIncidents.forEach(incident => {
            const [lng, lat] = incident.location.coordinates;

            const marker = L.marker([lat, lng], {
                icon: getMarkerIcon(incident.type, incident.severity)
            });

            marker.on('click', () => {
                setSelectedIncident(incident);
            });

            const popupContent = `
                <div style="min-width: 200px; font-family: system-ui;">
                    <div style="font-weight: bold; font-size: 14px; margin-bottom: 8px; color: #1e293b;">
                        ${incident.title}
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 4px; font-size: 12px; color: #64748b;">
                        <div><strong>Type:</strong> ${incident.type}</div>
                        <div><strong>Status:</strong> 
                            <span style="
                                padding: 2px 8px;
                                border-radius: 4px;
                                background: ${incident.status === 'resolved' ? '#dcfce7' : '#dbeafe'};
                                color: ${incident.status === 'resolved' ? '#166534' : '#1e40af'};
                                font-weight: 600;
                            ">${incident.status}</span>
                        </div>
                        <div><strong>Severity:</strong> ${incident.severity || 'N/A'}</div>
                        <div><strong>Verifications:</strong> ${incident.verificationCount || 0}</div>
                    </div>
                </div>
            `;

            marker.bindPopup(popupContent);
            markerClusterRef.current.addLayer(marker);
        });

        // Update heat map data
        if (showHeatMap && validIncidents.length > 0) {
            updateHeatMap(validIncidents);
        }
    }, [incidents, showHeatMap]);

    const updateHeatMap = (validIncidents) => {
        if (heatLayerRef.current) {
            mapInstanceRef.current.removeLayer(heatLayerRef.current);
        }

        const heatData = validIncidents.map(inc => {
            const [lng, lat] = inc.location.coordinates;
            const intensity = inc.severity === 'critical' ? 1.0 :
                inc.severity === 'high' ? 0.7 :
                    inc.severity === 'medium' ? 0.4 : 0.2;
            return [lat, lng, intensity];
        });

        heatLayerRef.current = L.heatLayer(heatData, {
            radius: 25,
            blur: 15,
            maxZoom: 17,
            gradient: {
                0.0: '#3b82f6',
                0.5: '#f59e0b',
                1.0: '#ef4444'
            }
        });

        mapInstanceRef.current.addLayer(heatLayerRef.current);
    };

    const toggleHeatMap = () => {
        setShowHeatMap(!showHeatMap);
        if (showHeatMap && heatLayerRef.current) {
            mapInstanceRef.current.removeLayer(heatLayerRef.current);
            heatLayerRef.current = null;
        }
    };

    return (
        <div className="relative w-full h-full">
            <div ref={mapRef} className="w-full h-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl" style={{ minHeight: '500px' }} />

            {/* Map Controls */}
            <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
                <button
                    onClick={toggleHeatMap}
                    className={`px-4 py-2 rounded-xl backdrop-blur-xl border font-bold text-sm transition-all shadow-lg ${showHeatMap
                            ? 'bg-red-500/90 border-red-400 text-white'
                            : 'bg-slate-900/90 border-white/20 text-white hover:bg-slate-800/90'
                        }`}
                >
                    {showHeatMap ? '🔥 Hide Heat Map' : '🗺️ Show Heat Map'}
                </button>
            </div>

            {/* Incident Detail Modal */}
            {selectedIncident && (
                <div className="absolute inset-0 z-[2000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-slate-900 border border-white/10 rounded-2xl max-w-md w-full p-6 shadow-2xl">
                        <div className="flex items-start justify-between mb-4">
                            <h3 className="text-xl font-black text-white">{selectedIncident.title}</h3>
                            <button
                                onClick={() => setSelectedIncident(null)}
                                className="p-2 hover:bg-white/10 rounded-lg transition-all"
                            >
                                <X className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm">
                                <AlertCircle className="w-4 h-4 text-blue-400" />
                                <span className="text-gray-400">Type:</span>
                                <span className="text-white font-bold capitalize">{selectedIncident.type}</span>
                            </div>

                            <div className="flex items-center gap-2 text-sm">
                                <MapPin className="w-4 h-4 text-green-400" />
                                <span className="text-gray-400">Location:</span>
                                <span className="text-white text-xs">{selectedIncident.location?.address || 'Unknown'}</span>
                            </div>

                            <div className="flex items-center gap-2 text-sm">
                                <Clock className="w-4 h-4 text-purple-400" />
                                <span className="text-gray-400">Reported:</span>
                                <span className="text-white">{new Date(selectedIncident.createdAt).toLocaleString()}</span>
                            </div>

                            <div className="pt-3 border-t border-white/10">
                                <p className="text-gray-300 text-sm leading-relaxed">{selectedIncident.description}</p>
                            </div>

                            <div className="flex items-center gap-2 pt-3">
                                <span className={`px-3 py-1 rounded-lg text-xs font-bold ${selectedIncident.status === 'resolved' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                                        selectedIncident.status === 'in-progress' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                                            'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                    }`}>
                                    {selectedIncident.status}
                                </span>
                                <span className="px-3 py-1 rounded-lg text-xs font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30">
                                    ✓ {selectedIncident.verificationCount || 0} Verifications
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default IncidentMap;

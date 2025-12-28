import React, { useState, useEffect } from 'react';
import { AlertTriangle, X, Radio } from 'lucide-react';
import useIncidentStore from '../../stores/incidentStore';
import toast from 'react-hot-toast';

const SOSButton = ({ className = '' }) => {
    const [isActive, setIsActive] = useState(false);
    const [countdown, setCountdown] = useState(3);
    const { createIncident } = useIncidentStore();
    const [sending, setSending] = useState(false);

    useEffect(() => {
        let timer;
        if (isActive && countdown > 0) {
            timer = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);
        } else if (isActive && countdown === 0) {
            triggerSOS();
        }

        return () => clearInterval(timer);
    }, [isActive, countdown]);

    const handleClick = () => {
        setIsActive(true);
        setCountdown(3);
        // Play alert sound if possible (optional)
    };

    const handleCancel = () => {
        setIsActive(false);
        setCountdown(3);
    };

    const triggerSOS = async () => {
        setSending(true);

        if (!navigator.geolocation) {
            toast.error('Geolocation is not supported by your browser');
            setSending(false);
            setIsActive(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;

                const incidentData = {
                    title: "SOS ALERT - HELP NEEDED",
                    type: "safety",
                    description: "CRITICAL: User triggered Panic Button. Immediate assistance required at these coordinates.",
                    severity: "critical",
                    location: {
                        coordinates: [longitude, latitude],
                        address: "Emergency Location Signal"
                    },
                    media: []
                };

                const result = await createIncident(incidentData);

                if (result.success) {
                    toast.error('SOS SIGNAL SENT! Responders Notified.', {
                        duration: 5000,
                        icon: '🚨'
                    });
                } else {
                    toast.error('Failed to send SOS signal');
                }

                setSending(false);
                setIsActive(false);
            },
            (error) => {
                console.error("SOS Location Error:", error);
                toast.error('Could not get location for SOS');
                setSending(false);
                setIsActive(false);
            },
            { enableHighAccuracy: true }
        );
    };

    if (isActive) {
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-red-900/90 backdrop-blur-sm animate-in fade-in duration-200">
                <div className="text-center">
                    <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-20"></div>
                    <div className="relative bg-white text-red-600 rounded-full w-64 h-64 flex flex-col items-center justify-center shadow-2xl scale-110 transition-transform">
                        <span className="text-6xl font-black mb-2">{countdown}</span>
                        <span className="text-xl font-bold uppercase tracking-widest">Sending SOS</span>

                        <button
                            onClick={handleCancel}
                            className="mt-8 px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-full font-bold flex items-center gap-2 transition-colors"
                        >
                            <X className="w-5 h-5" /> CANCEL
                        </button>
                    </div>
                    <p className="mt-8 text-white font-medium text-lg animate-pulse">Getting your location...</p>
                </div>
            </div>
        );
    }

    return (
        <button
            onClick={handleClick}
            className={`group relative flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold shadow-lg shadow-red-600/30 transition-all hover:scale-105 ${className}`}
        >
            <div className="absolute inset-0 rounded-lg bg-red-400 opacity-0 group-hover:animate-ping group-hover:opacity-30"></div>
            <AlertTriangle className="w-5 h-5" />
            <span>SOS</span>
        </button>
    );
};

export default SOSButton;

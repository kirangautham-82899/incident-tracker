import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import IncidentReportForm from '../components/incident/IncidentReportForm';
import { Radio, ShieldAlert } from 'lucide-react';

const ReportPage = () => {
    const navigate = useNavigate();

    const handleClose = () => {
        navigate('/dashboard');
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white relative overflow-hidden font-sans">
            <Navbar />

            {/* Background Animations */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[100px] animate-blob" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[100px] animate-blob animation-delay-4000" />
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTEgMWgydjJIMUMxem00IDBoMnYyaC0yVjF6bTQgMGgydjJoLTJWMXptNCAwaDJ2MmgtMlYxeiIvPjwvZz48L2c+PC9zdmc+')] opacity-20" />
            </div>

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10 pt-24">
                {/* Header */}
                <div className="text-center mb-12 animate-fadeIn">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono mb-6">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                        </span>
                        TRANSMISSION CHANNEL: OPEN
                    </div>

                    <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter mb-4">
                        NEW <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">INCIDENT</span> REPORT
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        Securely transmit incident data to the central command grid. All entries are encrypted and verified in real-time.
                    </p>
                </div>

                {/* Form Container */}
                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-500/20 blur-3xl rounded-full opacity-20"></div>
                    <div className="glass-card p-8 animate-fadeIn border border-white/10 bg-slate-800/50 backdrop-blur-xl rounded-3xl relative z-10" style={{ animationDelay: '0.2s' }}>
                        <IncidentReportForm onClose={handleClose} />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ReportPage;

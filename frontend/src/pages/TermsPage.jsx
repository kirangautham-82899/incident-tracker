import React from 'react';
import Navbar from '../components/layout/Navbar';
import { Scale, AlertCircle, UserCheck, ShieldCheck, CheckCircle } from 'lucide-react';

const TermsPage = () => {
    return (
        <div className="min-h-screen bg-slate-900 font-sans text-gray-300">
            <Navbar transparent />

            {/* Header Background */}
            <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-purple-900/20 to-slate-900 -z-10" />

            <div className="max-w-4xl mx-auto px-6 pt-32 pb-20">
                {/* Title */}
                <div className="text-center mb-16 animate-fadeIn">
                    <div className="inline-flex items-center justify-center p-3 bg-purple-500/10 rounded-2xl mb-6">
                        <Scale className="w-8 h-8 text-purple-400" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Terms of Service</h1>
                    <p className="text-xl text-gray-400">Effective Date: December 28, 2024</p>
                </div>

                {/* Content */}
                <div className="space-y-8 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <section className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm hover:bg-white/10 transition-colors">
                            <UserCheck className="w-8 h-8 text-blue-400 mb-4" />
                            <h2 className="text-xl font-bold text-white mb-3">User Responsibilities</h2>
                            <p className="text-sm leading-relaxed">
                                Users agree to provide accurate and truthful information when reporting incidents. False reporting or misuse of the platform may result in account suspension.
                            </p>
                        </section>

                        <section className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm hover:bg-white/10 transition-colors">
                            <AlertCircle className="w-8 h-8 text-red-400 mb-4" />
                            <h2 className="text-xl font-bold text-white mb-3">Emergency Disclaimer</h2>
                            <p className="text-sm leading-relaxed">
                                While we connect with responders, this app is NOT a replacement for 911/112. In life-threatening emergencies, always dial emergency services directly.
                            </p>
                        </section>

                        <section className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm hover:bg-white/10 transition-colors">
                            <ShieldCheck className="w-8 h-8 text-green-400 mb-4" />
                            <h2 className="text-xl font-bold text-white mb-3">Content Ownership</h2>
                            <p className="text-sm leading-relaxed">
                                You retain rights to photos/videos you upload, but grant us a license to use them for incident verification and display on the platform.
                            </p>
                        </section>

                        <section className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm hover:bg-white/10 transition-colors">
                            <CheckCircle className="w-8 h-8 text-yellow-400 mb-4" />
                            <h2 className="text-xl font-bold text-white mb-3">Acceptable Use</h2>
                            <p className="text-sm leading-relaxed">
                                Harassment, hate speech, and spamming are strictly prohibited. We reserve the right to remove content that violates these guidelines.
                            </p>
                        </section>
                    </div>

                    <section className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm mt-8">
                        <h2 className="text-2xl font-bold text-white mb-4">Platform Updates</h2>
                        <p className="leading-relaxed">
                            We may update these terms from time to time. Continued use of the platform after changes constitutes acceptance of the new terms.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default TermsPage;

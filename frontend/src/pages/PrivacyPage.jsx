import React from 'react';
import Navbar from '../components/layout/Navbar';
import { Shield, Lock, Eye, FileText, CheckCircle } from 'lucide-react';

const PrivacyPage = () => {
    return (
        <div className="min-h-screen bg-slate-900 font-sans text-gray-300">
            <Navbar transparent />

            {/* Header Background */}
            <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-900/20 to-slate-900 -z-10" />

            <div className="max-w-4xl mx-auto px-6 pt-32 pb-20">
                {/* Title */}
                <div className="text-center mb-16 animate-fadeIn">
                    <div className="inline-flex items-center justify-center p-3 bg-blue-500/10 rounded-2xl mb-6">
                        <Shield className="w-8 h-8 text-blue-400" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Privacy Policy</h1>
                    <p className="text-xl text-gray-400">Last updated: December 28, 2024</p>
                </div>

                {/* Content */}
                <div className="space-y-12 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
                    <section className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm">
                        <div className="flex items-start gap-4 mb-4">
                            <Lock className="w-6 h-6 text-blue-400 mt-1" />
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-4">Data Protection</h2>
                                <p className="leading-relaxed">
                                    Your privacy is our top priority. We utilize industry-standard encryption (AES-256) to protect your personal information and incident reports. We do not sell your data to third parties.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm">
                        <div className="flex items-start gap-4 mb-4">
                            <Eye className="w-6 h-6 text-purple-400 mt-1" />
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-4">Information We Collect</h2>
                                <ul className="space-y-3 list-none">
                                    {[
                                        "Account information (Name, Email)",
                                        "Incident reports and media (Photos, Videos)",
                                        "Location data for accurate reporting",
                                        "Device information for app optimization"
                                    ].map((item, idx) => (
                                        <li key={idx} className="flex items-center gap-3">
                                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </section>

                    <section className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm">
                        <div className="flex items-start gap-4 mb-4">
                            <FileText className="w-6 h-6 text-pink-400 mt-1" />
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-4">How We Use Your Data</h2>
                                <p className="leading-relaxed">
                                    Data collected is strictly used for:
                                </p>
                                <ul className="mt-4 space-y-3 list-disc list-inside text-gray-300">
                                    <li>Verifying and mapping incident reports</li>
                                    <li>Alerting nearby users and emergency responders</li>
                                    <li>Improving platform safety and reliability</li>
                                    <li>Preventing spam and abuse</li>
                                </ul>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPage;

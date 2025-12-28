import React, { useEffect } from 'react';
import useIncidentStore from '../../stores/incidentStore';
import IncidentCard from './IncidentCard';
import Loading from '../common/Loading';
import toast from 'react-hot-toast';
import { ClipboardList, RefreshCw } from 'lucide-react';

const IncidentList = () => {
    const { incidents, fetchIncidents, verifyIncident, isLoading } = useIncidentStore();

    useEffect(() => {
        fetchIncidents();
    }, []);

    const handleVerify = async (id) => {
        const result = await verifyIncident(id);
        if (result.success) {
            toast.success('Incident verified successfully');
        } else {
            toast.error(result.error || 'Failed to verify');
        }
    };

    if (isLoading && incidents.length === 0) {
        return <Loading text="Initializing Data Streams..." />;
    }

    if (incidents.length === 0) {
        return (
            <div className="text-center py-20 bg-slate-800/50 backdrop-blur rounded-3xl border border-white/5">
                <div className="inline-flex p-4 rounded-full bg-slate-700/50 mb-6">
                    <ClipboardList className="w-12 h-12 text-gray-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                    No Active Incidents
                </h3>
                <p className="text-gray-400">
                    All sectors clear. Monitoring for new reports...
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <span className="w-2 h-8 bg-blue-500 rounded-full"></span>
                        Recent Reports
                    </h2>
                </div>
                <button
                    onClick={() => fetchIncidents()}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                    title="Refresh Feed"
                >
                    <RefreshCw className="w-5 h-5" />
                </button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {incidents.map((incident) => (
                    <IncidentCard
                        key={incident._id}
                        incident={incident}
                        onVerify={handleVerify}
                    />
                ))}
            </div>
        </div>
    );
};

export default IncidentList;

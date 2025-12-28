import Incident from '../models/Incident.js';
import User from '../models/User.js';
import { INCIDENT_STATUS, INCIDENT_TYPES } from '../config/constants.js';

// @desc    Get analytics stats
// @route   GET /api/analytics/stats
// @access  Private (Admin/Responder)
export const getStats = async (req, res) => {
    try {
        // Total incidents
        const totalIncidents = await Incident.countDocuments();

        // Incidents by status
        const byStatus = await Incident.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Incidents by type
        const byType = await Incident.aggregate([
            {
                $group: {
                    _id: '$type',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Average response time (time from reported to resolved)
        const resolvedIncidents = await Incident.find({
            status: INCIDENT_STATUS.RESOLVED,
            resolvedAt: { $exists: true }
        });

        let avgResponseTime = 0;
        if (resolvedIncidents.length > 0) {
            const totalTime = resolvedIncidents.reduce((acc, inc) => {
                return acc + (inc.resolvedAt - inc.createdAt);
            }, 0);
            avgResponseTime = totalTime / resolvedIncidents.length / (1000 * 60 * 60); // in hours
        }

        // Recent incidents (last 24 hours)
        const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const recentIncidents = await Incident.countDocuments({
            createdAt: { $gte: last24Hours }
        });

        // Total users
        const totalUsers = await User.countDocuments();

        res.status(200).json({
            success: true,
            data: {
                totalIncidents,
                totalUsers,
                recentIncidents,
                avgResponseTimeHours: avgResponseTime.toFixed(2),
                byStatus,
                byType
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Get incident trends
// @route   GET /api/analytics/trends
// @access  Private (Admin/Responder)
export const getTrends = async (req, res) => {
    try {
        const { days = 7 } = req.query;
        const startDate = new Date(Date.now() - parseInt(days) * 24 * 60 * 60 * 1000);

        const trends = await Incident.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: {
                        date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                        type: '$type'
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { '_id.date': 1 }
            }
        ]);

        res.status(200).json({
            success: true,
            data: trends
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Get heatmap data
// @route   GET /api/analytics/heatmap
// @access  Public
export const getHeatmap = async (req, res) => {
    try {
        const { type, status } = req.query;

        const query = {};
        if (type) query.type = type;
        if (status) query.status = status;

        const incidents = await Incident.find(query)
            .select('location.coordinates type severity')
            .limit(1000);

        const heatmapData = incidents.map(inc => ({
            lat: inc.location.coordinates[1],
            lng: inc.location.coordinates[0],
            type: inc.type,
            severity: inc.severity,
            weight: inc.severity === 'critical' ? 3 : inc.severity === 'high' ? 2 : 1
        }));

        res.status(200).json({
            success: true,
            count: heatmapData.length,
            data: heatmapData
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

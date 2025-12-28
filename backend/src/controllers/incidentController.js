import Incident from '../models/Incident.js';
import User from '../models/User.js';
import { TYPE_PRIORITY_WEIGHTS, INCIDENT_STATUS } from '../config/constants.js';

// Helper function to calculate severity and priority
const calculatePriority = (incident) => {
    let score = 0;

    // Type weight
    score += TYPE_PRIORITY_WEIGHTS[incident.type] || 5;

    // Verification weight
    score += Math.min(incident.verificationCount * 2, 10);

    // Time weight (older = more urgent)
    const hoursSince = (Date.now() - incident.createdAt) / (1000 * 60 * 60);
    score += Math.min(hoursSince * 0.5, 5);

    return score;
};

// @desc    Create new incident
// @route   POST /api/incidents
// @access  Public (can be anonymous or authenticated)
export const createIncident = async (req, res) => {
    try {
        const { type, title, description, location, media, reporter, severity } = req.body;

        // Check for duplicates within 500m and 2 hours
        const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);

        const duplicates = await Incident.find({
            type,
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: location.coordinates
                    },
                    $maxDistance: 500 // meters
                }
            },
            createdAt: { $gte: twoHoursAgo },
            status: { $ne: INCIDENT_STATUS.RESOLVED }
        });

        // Create incident
        const incident = await Incident.create({
            type,
            title,
            description,
            location,
            media: media || [],
            reporter: {
                userId: req.user?._id,
                name: reporter?.name || req.user?.name || 'Anonymous',
                contact: reporter?.contact || req.user?.phone || ''
            },
            severity: severity || undefined // Use provided severity or default to model default
        });

        // Calculate initial priority
        incident.priority = calculatePriority(incident);
        await incident.save();

        // Update user's incident count if authenticated
        if (req.user) {
            await User.findByIdAndUpdate(req.user._id, {
                $inc: { incidentsReported: 1 }
            });
        }

        // Broadcast to all connected clients via Socket.IO
        const io = req.app.get('io');
        if (io) {
            io.emit('incident_created', incident);
            console.log('📡 Broadcasted incident_created event');
        }

        res.status(201).json({
            success: true,
            data: incident,
            possibleDuplicates: duplicates.length > 0 ? duplicates : undefined
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Get all incidents with filters
// @route   GET /api/incidents
// @access  Public
export const getIncidents = async (req, res) => {
    try {
        const { type, status, severity, limit = 50, page = 1, sort = '-createdAt' } = req.query;

        // Build query
        const query = {};
        if (type) query.type = type;
        if (status) query.status = status;
        if (severity) query.severity = severity;

        // Execute query with pagination
        const incidents = await Incident.find(query)
            .populate('assignedTo', 'name role')
            .sort(sort)
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit));

        const total = await Incident.countDocuments(query);

        res.status(200).json({
            success: true,
            count: incidents.length,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / parseInt(limit)),
            data: incidents
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Get single incident
// @route   GET /api/incidents/:id
// @access  Public
export const getIncident = async (req, res) => {
    try {
        const incident = await Incident.findById(req.params.id)
            .populate('assignedTo', 'name role email')
            .populate('verifications.userId', 'name reputation');

        if (!incident) {
            return res.status(404).json({
                success: false,
                error: 'Incident not found'
            });
        }

        res.status(200).json({
            success: true,
            data: incident
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Update incident
// @route   PUT /api/incidents/:id
// @access  Private (Admin/Responder)
export const updateIncident = async (req, res) => {
    try {
        const allowedUpdates = ['status', 'severity', 'assignedTo'];
        const updates = {};

        Object.keys(req.body).forEach(key => {
            if (allowedUpdates.includes(key)) {
                updates[key] = req.body[key];
            }
        });

        if (updates.status === INCIDENT_STATUS.RESOLVED) {
            updates.resolvedAt = new Date();
        }

        const incident = await Incident.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true, runValidators: true }
        );

        if (!incident) {
            return res.status(404).json({
                success: false,
                error: 'Incident not found'
            });
        }

        // Broadcast update via Socket.IO
        const io = req.app.get('io');
        if (io) {
            io.emit('incident_updated', incident);
            console.log('📡 Broadcasted incident_updated event');
        }

        res.status(200).json({
            success: true,
            data: incident
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Verify/upvote incident
// @route   POST /api/incidents/:id/verify
// @access  Private
export const verifyIncident = async (req, res) => {
    try {
        const incident = await Incident.findById(req.params.id);

        if (!incident) {
            return res.status(404).json({
                success: false,
                error: 'Incident not found'
            });
        }

        await incident.addVerification(req.user._id);

        // Update user's verification count
        await User.findByIdAndUpdate(req.user._id, {
            $inc: { incidentsVerified: 1, reputation: 1 }
        });

        // Recalculate priority
        incident.priority = calculatePriority(incident);
        await incident.save();

        // Broadcast verification via Socket.IO
        const io = req.app.get('io');
        if (io) {
            io.emit('incident_verified', incident);
            console.log('📡 Broadcasted incident_verified event');
        }

        res.status(200).json({
            success: true,
            data: incident
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Get nearby incidents
// @route   GET /api/incidents/nearby
// @access  Public
export const getNearbyIncidents = async (req, res) => {
    try {
        const { longitude, latitude, maxDistance = 5000, type, status } = req.query;

        if (!longitude || !latitude) {
            return res.status(400).json({
                success: false,
                error: 'Please provide longitude and latitude'
            });
        }

        const query = {
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [parseFloat(longitude), parseFloat(latitude)]
                    },
                    $maxDistance: parseInt(maxDistance)
                }
            }
        };

        if (type) query.type = type;
        if (status) query.status = status;

        const incidents = await Incident.find(query).limit(50);

        res.status(200).json({
            success: true,
            count: incidents.length,
            data: incidents
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Add admin note to incident
// @route   POST /api/incidents/:id/notes
// @access  Private (Admin/Responder)
export const addAdminNote = async (req, res) => {
    try {
        const { note } = req.body;

        const incident = await Incident.findById(req.params.id);

        if (!incident) {
            return res.status(404).json({
                success: false,
                error: 'Incident not found'
            });
        }

        incident.adminNotes.push({
            adminId: req.user._id,
            note
        });

        await incident.save();

        res.status(200).json({
            success: true,
            data: incident
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Delete incident
// @route   DELETE /api/incidents/:id
// @access  Private (Admin only)
export const deleteIncident = async (req, res) => {
    try {
        const incident = await Incident.findById(req.params.id);

        if (!incident) {
            return res.status(404).json({
                success: false,
                error: 'Incident not found'
            });
        }

        await incident.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

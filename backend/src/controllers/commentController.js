import Comment from '../models/Comment.js';
import Incident from '../models/Incident.js';

// @desc    Get comments for an incident
// @route   GET /api/incidents/:incidentId/comments
// @access  Public
export const getComments = async (req, res) => {
    try {
        const comments = await Comment.find({ incidentId: req.params.incidentId })
            .populate('userId', 'name role reputation')
            .sort('-createdAt')
            .limit(100);

        res.status(200).json({
            success: true,
            count: comments.length,
            data: comments
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Add comment to incident
// @route   POST /api/incidents/:incidentId/comments
// @access  Private
export const addComment = async (req, res) => {
    try {
        const { content } = req.body;

        // Check if incident exists
        const incident = await Incident.findById(req.params.incidentId);
        if (!incident) {
            return res.status(404).json({
                success: false,
                error: 'Incident not found'
            });
        }

        const comment = await Comment.create({
            incidentId: req.params.incidentId,
            userId: req.user._id,
            userName: req.user.name,
            userRole: req.user.role,
            content
        });

        await comment.populate('userId', 'name role reputation');

        res.status(201).json({
            success: true,
            data: comment
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Delete comment
// @route   DELETE /api/comments/:id
// @access  Private (Own comment or Admin)
export const deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);

        if (!comment) {
            return res.status(404).json({
                success: false,
                error: 'Comment not found'
            });
        }

        // Check ownership or admin
        if (comment.userId.toString() !== req.user._id.toString() &&
            req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                error: 'Not authorized to delete this comment'
            });
        }

        await comment.deleteOne();

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

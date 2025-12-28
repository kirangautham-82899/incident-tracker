import express from 'express';
import {
    createIncident,
    getIncidents,
    getIncident,
    updateIncident,
    verifyIncident,
    getNearbyIncidents,
    addAdminNote,
    deleteIncident
} from '../controllers/incidentController.js';
import { getComments, addComment } from '../controllers/commentController.js';
import { protect, authorize, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Public/Optional Auth routes
router.post('/', optionalAuth, createIncident);
router.get('/', getIncidents);
router.get('/nearby', getNearbyIncidents);
router.get('/:id', getIncident);

// Protected routes
router.put('/:id', protect, authorize('admin', 'responder'), updateIncident);
router.post('/:id/verify', protect, verifyIncident);
router.post('/:id/notes', protect, authorize('admin', 'responder'), addAdminNote);
router.delete('/:id', protect, authorize('admin'), deleteIncident);

// Comment routes
router.get('/:incidentId/comments', getComments);
router.post('/:incidentId/comments', protect, addComment);

export default router;

import express from 'express';
import { getStats, getTrends, getHeatmap } from '../controllers/analyticsController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/stats', protect, authorize('admin', 'responder'), getStats);
router.get('/trends', protect, authorize('admin', 'responder'), getTrends);
router.get('/heatmap', getHeatmap);

export default router;

import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import {
    addWatchlistItem,
    getWatchHistoryItem,
    getWatchlist,
    getWatchlistItem,
    markWatchHistoryCompleted,
    removeWatchlistItem,
    upsertWatchHistoryItem,
} from '../controllers/libraryController.js';

const router = express.Router();

router.get('/me/watchlist', authMiddleware, getWatchlist);
router.get('/me/watchlist/:dramaId', authMiddleware, getWatchlistItem);
router.post('/me/watchlist', authMiddleware, addWatchlistItem);
router.delete('/me/watchlist/:dramaId', authMiddleware, removeWatchlistItem);

router.get('/me/watch-history/:episodeId', authMiddleware, getWatchHistoryItem);
router.put('/me/watch-history', authMiddleware, upsertWatchHistoryItem);
router.patch('/me/watch-history/:episodeId/completed', authMiddleware, markWatchHistoryCompleted);

export default router;
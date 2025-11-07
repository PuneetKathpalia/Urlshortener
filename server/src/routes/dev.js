import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { shortenHandler } from './url.js';

const router = express.Router();

// Programmatic shorten endpoint (JWT bearer required)
router.post('/shorten', requireAuth, shortenHandler);

export default router;

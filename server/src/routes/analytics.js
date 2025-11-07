import express from 'express';
import Url from '../models/Url.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', requireAuth, async (req, res) => {
  try {
    const urls = await Url.find({ owner: req.user.id }).sort({ createdAt: -1 });
    res.json({ count: urls.length, urls });
  } catch (e) {
    res.status(500).json({ message: 'Failed to load analytics' });
  }
});

router.get('/:slug', requireAuth, async (req, res) => {
  try {
    const url = await Url.findOne({ slug: req.params.slug, owner: req.user.id });
    if (!url) return res.status(404).json({ message: 'Not found' });
    res.json(url);
  } catch (e) {
    res.status(500).json({ message: 'Failed to load analytics' });
  }
});

export default router;

import express from 'express';
import Url from '../models/Url.js';
import Click from '../models/Click.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Overview: totals and clicks per day (last 14 days)
router.get('/overview', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const urls = await Url.find({ owner: userId }).select('_id createdAt');
    const ids = urls.map(u => u._id);

    const totalLinks = urls.length;

    const totalClicksAgg = await Click.aggregate([
      { $match: { url: { $in: ids } } },
      { $count: 'count' }
    ]);
    const totalClicks = totalClicksAgg[0]?.count || 0;

    const since = new Date();
    since.setDate(since.getDate() - 13); // 14 days inclusive
    const perDay = await Click.aggregate([
      { $match: { url: { $in: ids }, createdAt: { $gte: since } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    // Normalize missing days
    const days = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0,10);
      const item = perDay.find(p => p._id === key);
      days.push({ date: key, clicks: item?.count || 0 });
    }

    res.json({ totalLinks, totalClicks, clicksPerDay: days });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Failed to load overview' });
  }
});

// CSV export of user's URLs
router.get('/export', requireAuth, async (req, res) => {
  try {
    const urls = await Url.find({ owner: req.user.id }).sort({ createdAt: -1 });
    const header = ['slug','originalUrl','shortUrl','clicks','category','tags','createdAt','expiresAt'];
    const rows = urls.map(u => [u.slug, u.originalUrl, u.shortUrl, u.clicks, u.category || '', (u.tags||[]).join('|'), u.createdAt?.toISOString() || '', u.expiresAt?.toISOString() || '']);
    const csv = [header.join(','), ...rows.map(r => r.map(v => '"' + String(v).replace(/"/g,'""') + '"').join(','))].join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="analytics.csv"');
    res.send(csv);
  } catch (e) {
    res.status(500).json({ message: 'Failed to export CSV' });
  }
});

// Admin: list all users' URLs (example role-protected)
router.get('/admin/all', requireAuth, requireRole('admin'), async (_req, res) => {
  const urls = await Url.find({}).sort({ createdAt: -1 }).limit(200);
  res.json(urls);
});

export default router;

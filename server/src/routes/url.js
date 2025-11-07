import express from 'express';
import { nanoid } from 'nanoid';
import Url from '../models/Url.js';
import { optionalAuth } from '../middleware/auth.js';
import Click from '../models/Click.js';

const router = express.Router();

function isValidUrl(url) {
  try {
    const u = new URL(url);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

export async function shortenHandler(req, res) {
  try {
    const { originalUrl, customSlug, expiresAt, category, tags } = req.body;
    if (!originalUrl || !isValidUrl(originalUrl)) {
      return res.status(400).json({ message: 'Valid originalUrl required' });
    }

    let slug = (customSlug || '').trim();
    if (slug) {
      const exists = await Url.findOne({ slug });
      if (exists) return res.status(409).json({ message: 'Custom slug already taken' });
    } else {
      slug = nanoid(7);
    }

    const base = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
    const shortUrl = `${base}/${slug}`;

    const doc = await Url.create({
      slug,
      originalUrl,
      shortUrl,
      owner: req.user?.id || null,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      category: category || 'Other',
      tags: Array.isArray(tags) ? tags : (typeof tags === 'string' && tags ? tags.split(',').map(s=>s.trim()).filter(Boolean) : []),
    });

    res.status(201).json(doc);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Could not shorten URL' });
  }
}

router.post('/shorten', optionalAuth, shortenHandler);

export async function redirectHandler(req, res) {
  const { slug } = req.params;
  if (!slug || slug === 'favicon.ico' || slug === 'api' || slug === 'health') {
    return res.status(404).json({ message: 'Not found' });
  }

  try {
    const doc = await Url.findOne({ slug });
    if (!doc) return res.status(404).json({ message: 'Not found' });

    if (doc.expiresAt && new Date(doc.expiresAt).getTime() < Date.now()) {
      return res.status(410).send('<h1>Link expired</h1>');
    }

    doc.clicks += 1;
    await doc.save();

    // log click
    await Click.create({ url: doc._id });

    return res.redirect(doc.originalUrl);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'Server error' });
  }
}

export default router;

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';

import authRoutes from './routes/auth.js';
import urlRoutes, { redirectHandler } from './routes/url.js';
import analyticsRoutes from './routes/analytics.js';
import statsRoutes from './routes/stats.js';
import devRoutes from './routes/dev.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/urlshortener';
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';

app.set('trust proxy', 1);
app.use(helmet());
app.use(cors({ origin: CORS_ORIGIN === '*' ? true : CORS_ORIGIN.split(',').map(s => s.trim()), credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/url', urlRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/dev', devRoutes);

// Redirect: keep last so it doesn't catch API routes
app.get('/:slug', redirectHandler);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

mongoose.connect(MONGO_URI).then(() => {
  console.log('MongoDB connected');
  app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
}).catch((err) => {
  console.error('Mongo connection error', err);
  process.exit(1);
});

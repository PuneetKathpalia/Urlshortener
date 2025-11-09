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
async function startServer() {
  app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
}

async function connectMongo() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected to', MONGO_URI);
    await startServer();
    return;
  } catch (err) {
    console.error('Mongo connection error', err);
    // Only try in-memory fallback if explicitly requested AND package is available
    if (process.env.DEV_IN_MEMORY === 'true') {
      try {
        console.log('DEV_IN_MEMORY=true — attempting to load mongodb-memory-server dynamically');
        const { MongoMemoryServer } = await import('mongodb-memory-server');
        const mongod = await MongoMemoryServer.create();
        const memUri = mongod.getUri();
        // keep reference to prevent GC
        global.__MONGOD__ = mongod;
        await mongoose.connect(memUri);
        console.log('Connected to in-memory MongoDB');
        await startServer();
        return;
      } catch (memErr) {
        console.error('In-memory MongoDB not available or failed to start', memErr);
      }
    }
    process.exit(1);
  }
}

connectMongo();

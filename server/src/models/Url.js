import mongoose from 'mongoose';

const CATEGORIES = ['Work', 'Personal', 'Projects', 'Other'];

const urlSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true, index: true },
  originalUrl: { type: String, required: true },
  shortUrl: { type: String, required: true },
  clicks: { type: Number, default: 0 },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  expiresAt: { type: Date, default: null },
  category: { type: String, enum: CATEGORIES, default: 'Other', index: true },
  tags: { type: [String], default: [], index: true },
}, { timestamps: true });

export { CATEGORIES };
export default mongoose.model('Url', urlSchema);

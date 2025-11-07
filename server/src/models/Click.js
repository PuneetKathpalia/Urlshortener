import mongoose from 'mongoose';

const clickSchema = new mongoose.Schema({
  url: { type: mongoose.Schema.Types.ObjectId, ref: 'Url', required: true, index: true },
}, { timestamps: true });

export default mongoose.model('Click', clickSchema);

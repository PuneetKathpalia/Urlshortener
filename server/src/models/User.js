import mongoose from 'mongoose';

const ROLES = ['user', 'admin'];

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ROLES, default: 'user', index: true },
}, { timestamps: true });

export { ROLES };
export default mongoose.model('User', userSchema);

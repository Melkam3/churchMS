import mongoose from 'mongoose';

const ministrySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, unique: true },
  description: { type: String, trim: true },
  leader: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', default: null },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Member' }],
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model('Ministry', ministrySchema);

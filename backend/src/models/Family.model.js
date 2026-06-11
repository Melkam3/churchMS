import mongoose from 'mongoose';

const familySchema = new mongoose.Schema({
  familyName: { type: String, required: true, trim: true },
  headOfFamily: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', default: null },
  address: { type: String, trim: true },
  phone: { type: String, trim: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Member' }],
}, { timestamps: true });

export default mongoose.model('Family', familySchema);

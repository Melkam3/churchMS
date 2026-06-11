import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  middleName: { type: String, trim: true },
  lastName: { type: String, required: true, trim: true },
  gender: { type: String, enum: ['Male', 'Female'], required: true },
  dateOfBirth: { type: Date },
  phone: { type: String, trim: true },
  email: { type: String, lowercase: true, trim: true },
  address: { type: String, trim: true },
  occupation: { type: String, trim: true },
  baptismStatus: { type: String, enum: ['Baptized', 'Not Baptized', 'Pending'], default: 'Not Baptized' },
  membershipStatus: { type: String, enum: ['Active', 'Inactive', 'Transferred', 'Deceased'], default: 'Active' },
  joinDate: { type: Date, default: Date.now },
  profilePhoto: { type: String, default: null },
  family: { type: mongoose.Schema.Types.ObjectId, ref: 'Family', default: null },
}, { timestamps: true });

memberSchema.virtual('fullName').get(function () {
  return [this.firstName, this.middleName, this.lastName].filter(Boolean).join(' ');
});

memberSchema.set('toJSON', { virtuals: true });
memberSchema.set('toObject', { virtuals: true });

export default mongoose.model('Member', memberSchema);

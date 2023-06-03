const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    gender: { type: String, enum: ['male', 'female', 'other'] },
    mobile: { type: String },
    isPrivateProfile: { type: Boolean, default: false },
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

module.exports = User;

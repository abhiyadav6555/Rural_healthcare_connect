const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['patient', 'doctor'],
    required: true,
  },
    age: Number,
  gender: String,
  mobile: String,
  photo: String, // uploaded file ka naam store hoga
  country: String,
  state: String,
  city: String,
  village: String,
  medicalHistory: String,

  specialization: String,
  experience: Number,
  availability: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  symptoms: {
    type: String,
    required: true,
  },
    patientImage: {
    type: String,
    default: '',
  },
  urgencyLevel: {
    type: String,
    enum: ['low', 'medium', 'emergency'],
    default: 'low',
  },
  date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'completed'],
    default: 'pending',
  },
  prescription: {
    type: String,
    default: '',
  },
    prescriptionGivenAt: {
    type: Date,
    default: null,
  },
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
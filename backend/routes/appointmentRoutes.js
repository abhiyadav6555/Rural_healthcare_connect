const express = require('express');
const Appointment = require('../models/Appointment');
const protect = require('../middleware/auth');
const upload = require('../middleware/upload');
const router = express.Router();

// @route  POST /api/appointments  (patient books an appointment, photo attach kar sakta hai)
router.post('/', protect, upload.single('patientImage'), async (req, res) => {
  try {
    const { doctorId, symptoms, urgencyLevel, date } = req.body;

    const appointment = await Appointment.create({
      patient: req.user.id,
      doctor: doctorId,
      symptoms,
      urgencyLevel,
      date,
      patientImage: req.file ? req.file.filename : '',
    });

    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route  GET /api/appointments/my  (logged-in user ke appointments - patient ya doctor)
router.get('/my', protect, async (req, res) => {
  try {
    const filter = req.user.role === 'doctor' ? { doctor: req.user.id } : { patient: req.user.id };
    const appointments = await Appointment.find(filter)
      .populate('patient', 'name email age gender')
      .populate('doctor', 'name specialization');

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route  PUT /api/appointments/:id/status  (doctor accept/reject/complete kare)
router.put('/:id/status', protect, async (req, res) => {
  try {
    const { status, prescription } = req.body;

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (appointment.doctor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // PERMANENT RECORD LOCK: ek baar completed ho jaye to kabhi edit nahi ho sakta
    if (appointment.status === 'completed') {
      return res.status(403).json({
        message: 'This appointment is already completed. The prescription is a permanent record and cannot be edited.',
      });
    }

    appointment.status = status;

    if (prescription && status === 'completed') {
      appointment.prescription = prescription;
      appointment.prescriptionGivenAt = new Date();
    }

    await appointment.save();

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
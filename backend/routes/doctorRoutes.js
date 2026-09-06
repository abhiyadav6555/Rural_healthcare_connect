const express = require('express');
const User = require('../models/User');
const router = express.Router();

// @route  GET /api/doctors  (list all doctors, optional filters)
router.get('/', async (req, res) => {
  try {
    const { specialization, location } = req.query;
    const filter = { role: 'doctor' };

    if (specialization) filter.specialization = new RegExp(specialization, 'i');
    if (location) filter.location = new RegExp(location, 'i');

    const doctors = await User.find(filter).select('-password');
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
const express = require('express');
const router = express.Router();

// Simple rule-based symptom -> urgency mapping (baad mein ML model se replace kar sakte ho)
const emergencySymptoms = ['chest pain', 'difficulty breathing', 'severe bleeding', 'unconsciousness', 'stroke'];
const mediumSymptoms = ['high fever', 'persistent vomiting', 'severe headache', 'broken bone'];

router.post('/check', (req, res) => {
  const { symptoms } = req.body; // symptoms: array of strings

  if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
    return res.status(400).json({ message: 'Please provide symptoms as an array' });
  }

  const lowerSymptoms = symptoms.map((s) => s.toLowerCase());

  let urgencyLevel = 'low';
  let advice = 'Aapke symptoms mild lagte hain. Ek general physician se consultation le sakte hain.';

  const hasEmergency = lowerSymptoms.some((s) => emergencySymptoms.includes(s));
  const hasMedium = lowerSymptoms.some((s) => mediumSymptoms.includes(s));

  if (hasEmergency) {
    urgencyLevel = 'emergency';
    advice = 'Ye symptoms serious ho sakte hain. Turant nearest hospital jayein ya emergency doctor se connect karein.';
  } else if (hasMedium) {
    urgencyLevel = 'medium';
    advice = 'In symptoms ke liye jaldi doctor se consultation lena behtar hoga.';
  }

  res.json({ urgencyLevel, advice });
});

module.exports = router;
const express = require('express');
const Appointment = require('../models/appointment.model');
const { verifyToken, checkRole } = require('../middleware/auth.middleware');
const router = express.Router();

// Create an appointment (Patient only)
router.post('/', verifyToken, checkRole(['Patient']), async (req, res) => {
  try {
    const { doctorId, date, time } = req.body;

    const newAppointment = new Appointment({
      patientId: req.user.id,
      doctorId,
      date,
      time,
    });

    const savedAppointment = await newAppointment.save();
    res.status(201).json(savedAppointment);
  } catch (err) {
    res.status(500).json({ error: 'Error creating appointment.', details: err.message });
  }
});

// Approve or reject an appointment (Doctor only)
router.patch('/:id', verifyToken, checkRole(['Doctor']), async (req, res) => {
  const { status } = req.body;
  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status. Must be "approved" or "rejected".' });
  }
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!appointment) return res.status(404).json({ error: 'Appointment not found.' });

    res.status(200).json({ message: `Appointment ${status} successfully.`, appointment });
  } catch (err) {
    res.status(500).json({ error: 'Error updating appointment.', details: err.message });
  }
});

module.exports = router;

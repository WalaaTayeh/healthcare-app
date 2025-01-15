const express = require('express');
const User = require('../models/user.model');
const Billing = require('../models/billing.model');

const { verifyToken, checkRole } = require('../middleware/auth.middleware');
const router = express.Router();

router.get('/users', verifyToken, checkRole(['Admin']), async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching users.', details: err.message });
  }
});


router.patch('/users/:id/status', verifyToken, checkRole(['Admin']), async (req, res) => {
  const { status } = req.body;
  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status. Must be "approved" or "rejected".' });
  }

  try {
    const user = await User.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!user) return res.status(404).json({ error: 'User not found.' });

    res.status(200).json({ message: `User ${status} successfully.`, user });
  } catch (err) {
    res.status(500).json({ error: 'Error updating user status.', details: err.message });
  }
});


router.delete('/users/:id', verifyToken, checkRole(['Admin']), async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found.' });

    res.status(200).json({ message: 'User deleted successfully.', user });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting user.', details: err.message });
  }
});

router.get('/billing', verifyToken, checkRole(['Admin']), async (req, res) => {
  try {
    const bills = await Billing.find().populate('patientId', 'username email');
    res.status(200).json(bills);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching billing records.', details: err.message });
  }
});

router.post('/billing', verifyToken, checkRole(['Admin']), async (req, res) => {
  try {
    const { patientId, amount } = req.body;

    const newBilling = new Billing({ patientId, amount });
    const savedBilling = await newBilling.save();

    res.status(201).json(savedBilling);
  } catch (err) {
    res.status(500).json({ error: 'Error creating billing record.', details: err.message });
  }
});

router.patch('/billing/:id', verifyToken, checkRole(['Admin']), async (req, res) => {
  const { status } = req.body;
  if (!['unpaid', 'paid'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status. Must be "unpaid" or "paid".' });
  }

  try {
    const bill = await Billing.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!bill) return res.status(404).json({ error: 'Billing record not found.' });

    res.status(200).json({ message: `Billing status updated to ${status}.`, bill });
  } catch (err) {
    res.status(500).json({ error: 'Error updating billing status.', details: err.message });
  }
});

module.exports = router;

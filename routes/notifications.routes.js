const express = require('express');
const router = express.Router();
const Notification = require('../models/notification.model');

// Get all notifications
router.get('/', async (req, res) => {
    try {
        const notifications = await Notification.find();
        res.json(notifications);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a new notification
router.post('/', async (req, res) => {
    const notification = new Notification({
        userId: req.body.userId,
        message: req.body.message
    });

    try {
        const newNotification = await notification.save();
        res.status(201).json(newNotification);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Mark a notification as read
router.patch('/:id', async (req, res) => {
    try {
        const updatedNotification = await Notification.findByIdAndUpdate(
            req.params.id,
            { read: true },
            { new: true }
        );
        res.json(updatedNotification);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a notification
router.delete('/:id', async (req, res) => {
    try {
        await Notification.findByIdAndDelete(req.params.id);
        res.json({ message: 'Notification deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;

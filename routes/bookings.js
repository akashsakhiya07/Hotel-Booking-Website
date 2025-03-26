const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Middleware to verify token
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

// Create a new booking
router.post('/', verifyToken, async (req, res) => {
    try {
        console.log('Received booking request:', req.body); // Debug log

        const { roomType, checkIn, checkOut, adults, children, rooms } = req.body;
        
        // Find user
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Create new booking
        const booking = {
            roomType,
            checkIn: new Date(checkIn),
            checkOut: new Date(checkOut),
            adults: adults || 1,
            children: children || 0,
            rooms: rooms || 1,
            status: 'pending'
        };

        console.log('Creating booking:', booking); // Debug log

        // Add booking to user's bookings array
        user.bookings.push(booking);
        await user.save();

        console.log('Booking saved successfully'); // Debug log

        // Return updated user data without password
        const updatedUser = await User.findById(user._id).select('-password');
        res.status(201).json({
            message: 'Booking created successfully',
            booking,
            user: updatedUser
        });
    } catch (error) {
        console.error('Error creating booking:', error); // Debug log
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get all bookings for a user
router.get('/', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        console.log('Fetching bookings for user:', user._id); // Debug log
        console.log('User bookings:', user.bookings); // Debug log

        res.json(user.bookings);
    } catch (error) {
        console.error('Error fetching bookings:', error); // Debug log
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router; 
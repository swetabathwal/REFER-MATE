const express = require('express');
const User = require('./user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = express.Router();

// Register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user — password will be hashed by pre('save') hook
        const user = new User({
            name,
            email,
            password
        });

        await user.save();

        res.status(201).json({
            message: 'User created successfully',
            user: { id: user._id, name: user.name, email: user.email }
        });

    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        let isMatch = false;

        // Try comparing with bcrypt (hashed password)
        try {
            isMatch = await bcrypt.compare(password, user.password);
        } catch (err) {
            isMatch = false;
        }

        // If bcrypt comparison failed, check if DB has plain-text password
        if (!isMatch && password === user.password) {
            isMatch = true;

            // Immediately hash the plain-text password for future logins
            user.password = await bcrypt.hash(password, 10);
            await user.save();
            console.log(`Password for ${email} was plain text → now hashed`);
        }

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({
            token,
            user: { id: user._id, name: user.name, email: user.email }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});



module.exports = router;

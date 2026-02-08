const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../database');

const SECRET_KEY = 'your_secret_key_here';

// Register User
router.post('/register', async (req, res) => {
    const { name, email, password, role, rollNo, classSection } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: "Name, Email, and Password are required." });
    }

    try {
        // Check if email exists
        const existingUser = await db.users.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Email already exists." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = {
            name,
            email,
            password: hashedPassword,
            role: role || 'student',
            rollNo,
            classSection,
            photoUrl: null // Placeholder
        };

        const doc = await db.users.insert(newUser);
        res.json({ message: "User registered successfully.", id: doc._id });
    } catch (err) {
        res.status(500).json({ error: "Server error during registration." });
    }
});

// Login User
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await db.users.findOne({ email });
        if (!user) return res.status(400).json({ error: "Invalid email or password." });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ error: "Invalid email or password." });

        const token = jwt.sign({ id: user._id, role: user.role, name: user.name }, SECRET_KEY, { expiresIn: '1d' });
        res.json({ token, user: { id: user._id, name: user.name, role: user.role, rollNo: user.rollNo } });
    } catch (err) {
        res.status(500).json({ error: "Server error." });
    }
});

module.exports = router;

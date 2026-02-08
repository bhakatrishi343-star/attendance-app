const express = require('express');
const router = express.Router();
const db = require('../database');
const multer = require('multer');
const path = require('path');
const aiService = require('../ai-service');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, 'attendance-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Mark Attendance
router.post('/mark', upload.single('photo'), async (req, res) => {
    const { userId, subject, date } = req.body;
    const photo = req.file;

    if (!photo) {
        return res.status(400).json({ error: "Photo is required." });
    }

    try {
        // Find User
        const user = await db.users.findOne({ _id: userId });
        if (!user) return res.status(400).json({ error: "User not found." });

        // AI Verification
        const verification = await aiService.verifyFace(photo.path, user.photoUrl);
        if (!verification.match) {
            return res.status(400).json({ error: "Face verification failed." });
        }

        // Check Duplicate
        const existing = await db.attendance.findOne({ userId, subject, date });
        if (existing) {
            return res.status(400).json({ error: "Attendance already marked today." });
        }

        // Insert Attendance
        const newRecord = {
            userId,
            subject,
            date,
            photoProof: photo.path,
            status: 'present',
            timestamp: new Date()
        };
        await db.attendance.insert(newRecord);

        res.json({ message: "Attendance marked successfully.", verification });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get History
router.get('/history/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const history = await db.attendance.find({ userId }).sort({ date: -1, timestamp: -1 });
        // Map _id to id for frontend compatibility if needed, though frontend handles .id just fine usually if we use _id
        const mappedHistory = history.map(h => ({ ...h, id: h._id }));
        res.json({ history: mappedHistory });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

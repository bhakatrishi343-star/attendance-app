const express = require('express');
const router = express.Router();
const db = require('../database');

const isAdmin = (req, res, next) => next();

// --- USERS ---
router.get('/users', isAdmin, async (req, res) => {
    try {
        const users = await db.users.find({});
        res.json(users.map(u => ({ ...u, id: u._id })));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/users/:id', isAdmin, async (req, res) => {
    const { id } = req.params;
    const { name, role, rollNo, classSection } = req.body;
    try {
        await db.users.update({ _id: id }, { $set: { name, role, rollNo, classSection } });
        res.json({ message: "User updated." });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/users/:id', isAdmin, async (req, res) => {
    try {
        await db.users.remove({ _id: req.params.id }, {});
        res.json({ message: "User deleted." });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- ATTENDANCE ---
router.get('/attendance', isAdmin, async (req, res) => {
    try {
        // Manual Join
        const attendances = await db.attendance.find({}).sort({ date: -1 });
        const users = await db.users.find({});
        const userMap = users.reduce((acc, u) => { acc[u._id] = u; return acc; }, {});

        const joined = attendances.map(a => ({
            ...a,
            id: a._id,
            name: userMap[a.userId] ? userMap[a.userId].name : 'Unknown',
            rollNo: userMap[a.userId] ? userMap[a.userId].rollNo : 'N/A'
        }));

        res.json(joined);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/attendance/:id', isAdmin, async (req, res) => {
    const { id } = req.params;
    const { status, subject } = req.body;
    try {
        await db.attendance.update({ _id: id }, { $set: { status, subject } });
        res.json({ message: "Attendance updated." });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/attendance/:id', isAdmin, async (req, res) => {
    try {
        await db.attendance.remove({ _id: req.params.id }, {});
        res.json({ message: "Attendance record deleted." });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const db = require('../database');

// GET all subjects (Auto-seed if empty for MVP)
router.get('/', async (req, res) => {
    try {
        const count = await db.subjects.count({});
        if (count === 0) {
            const defaults = [
                { name: 'Mathematics', code: 'MATH101' },
                { name: 'Computer Science', code: 'CS101' },
                { name: 'Physics', code: 'PHY101' },
                { name: 'English', code: 'ENG101' },
                { name: 'General', code: 'GEN' }
            ];
            await db.subjects.insert(defaults);
        }
        const allSubjects = await db.subjects.find({}).sort({ name: 1 });
        res.json(allSubjects);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ADD a new subject (Admin only technically, but open for MVP setup)
router.post('/', async (req, res) => {
    const { name, code } = req.body;
    if (!name) return res.status(400).json({ error: "Subject name is required" });

    try {
        const existing = await db.subjects.findOne({ name });
        if (existing) return res.status(400).json({ error: "Subject already exists" });

        const newSubject = await db.subjects.insert({ name, code, createdAt: new Date() });
        res.json(newSubject);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE a subject
router.delete('/:id', async (req, res) => {
    try {
        await db.subjects.remove({ _id: req.params.id }, {});
        res.json({ message: "Subject deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Seed default subjects if empty
router.get('/seed', async (req, res) => {
    try {
        const count = await db.subjects.count({});
        if (count === 0) {
            const defaults = [
                { name: 'Mathematics', code: 'MATH101' },
                { name: 'Computer Science', code: 'CS101' },
                { name: 'Physics', code: 'PHY101' },
                { name: 'English', code: 'ENG101' },
                { name: 'General', code: 'GEN' }
            ];
            await db.subjects.insert(defaults);
            return res.json({ message: "Seeded default subjects", subjects: defaults });
        }
        res.json({ message: "Subjects already exist" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

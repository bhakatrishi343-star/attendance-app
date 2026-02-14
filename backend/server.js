const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

console.log("Starting Backend...");
console.log("Using Port:", PORT);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (uploaded photos) - Create 'uploads' dir if not exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}
app.use('/uploads', express.static(uploadsDir));

// Routes
const authRoutes = require('./routes/auth');
const attendanceRoutes = require('./routes/attendance');
const adminRoutes = require('./routes/admin');
const subjectRoutes = require('./routes/subjects');

app.use('/api/auth', authRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/subjects', subjectRoutes);

app.get('/', (req, res) => {
    res.send('Automated Attendance Backend is Running');
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

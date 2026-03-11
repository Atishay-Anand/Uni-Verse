const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// 1. Connect to the Uni-Verse Database
// Inside server.js

const mongoURI = "mongodb+srv://anand_arha_h_db_user:Sking279!@cluster0.jrzy8h8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(mongoURI)
  .then(() => console.log("✅ Uni-Verse is connected to the Cloud!"))
  .catch(err => console.error("❌ Cloud Error: ", err));
 
// 2. Simple test route
app.get('/', (req, res) => res.send("Uni-Verse Backend is officially running!"));
// Test Route to check Attendance Logic
app.get('/test-attendance', (req, res) => {
    const attendancePercent = 72; // Simulated data
    if (attendancePercent < 75) {
        res.json({ 
            status: "Warning", 
            message: `Attendance is ${attendancePercent}%. Alert: Below 75% threshold!` 
        });
    } else {
        res.json({ status: "Good", message: "Attendance is on track." });
    }
});
const User = require('./models/User');

// Temporary route to create a test user
app.get('/add-test-student', async (req, res) => {
    try {
        const testUser = new User({
            name: "Ipsita",
            email: "ipsita@universe.com",
            rollNo: "UNI101",
            password: "password123"
        });

        await testUser.save();
        res.send("🎉 Success! Ipsita has been added to the Uni-Verse database.");
    } catch (err) {
        res.status(500).send("❌ Error saving user: " + err.message);
    }
});
const Mood = require('./models/Mood');

// Route to log mood and check for Burnout Risk
app.post('/api/mood', async (req, res) => {
    try {
        const { userId, rating, note } = req.body;
        
        const newMood = new Mood({ user: userId, rating, note });
        await newMood.save();

        // Analytics Logic: If rating is 1 or 2, it's a Burnout Risk
        let suggestion = "Keep up the great work!";
        if (rating <= 2) {
            suggestion = "🔥 Burnout Risk Alert: You've been feeling low. Consider taking a short break or talking to a friend.";
        } else if (rating === 3) {
            suggestion = "You're doing okay, but don't forget to stay hydrated!";
        }

        res.json({
            status: "Success",
            message: "Mood logged!",
            recommendation: suggestion
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Test Route: Log a low mood for Ipsita to see the Burnout Alert
app.get('/test-burnout', async (req, res) => {
    try {
        // We'll use a hardcoded User ID for now (from your Atlas screenshot)
        const moodRecord = new Mood({
            user: "69b08167d400521d9a9fe76a", // This is Ipsita's ID from your screenshot
            rating: 2, // Low rating to trigger alert
            note: "Feeling really overwhelmed with the backend today!"
        });

        await moodRecord.save();

        // The logic for the alert
        let alertMessage = "You're doing great!";
        if (moodRecord.rating <= 2) {
            alertMessage = "🔥 Burnout Risk Alert: Your mood rating is low. Take a 15-minute walk!";
        }

        res.json({
            message: "Mood Saved!",
            recommendation: alertMessage
        });
    } catch (err) {
        res.status(500).send("Error: " + err.message);
    }
});
// 3. Start the server
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server listening on port ${PORT}`));
const Attendance = require('./models/Attendance');

// Route to log attendance and check the 75% limit
app.post('/api/attendance', async (req, res) => {
    try {
        const { userId, subject, status } = req.body;
        const newRecord = new Attendance({ user: userId, subject, status });
        await newRecord.save();

        // Logic: Calculate total classes for this subject
        const totalClasses = await Attendance.countDocuments({ user: userId, subject });
        const presentClasses = await Attendance.countDocuments({ user: userId, subject, status: 'Present' });
        
        const percentage = (presentClasses / totalClasses) * 100;

        let alert = percentage < 75 ? "⚠️ Warning: Attendance below 75%!" : "✅ Attendance is safe.";

        res.json({ 
            message: "Attendance logged!", 
            currentPercentage: percentage.toFixed(2) + "%",
            status: alert 
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
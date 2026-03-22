const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// ✅ Import models (MUST be at top)
const User = require('./models/User');
const Mood = require('./models/Mood');
const Attendance = require('./models/Attendance');

const app = express();
app.use(cors());
app.use(express.json());

/* ================= DATABASE CONNECTION ================= */

// ⚠️ Fixed password (! → %21)
const mongoURI = "mongodb+srv://anand_arha_h_db_user:Sking279%21@cluster0.jrzy8h8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(mongoURI)
  .then(() => console.log("✅ Uni-Verse connected to MongoDB Atlas"))
  .catch(err => console.error("❌ DB Error:", err));

/* ================= BASIC ROUTES ================= */

app.get('/', (req, res) => {
  res.send("🚀 Uni-Verse Backend is running!");
});

app.get('/test-attendance', (req, res) => {
  const attendancePercent = 72;

  if (attendancePercent < 75) {
    res.json({
      status: "Warning",
      message: `⚠️ Attendance is ${attendancePercent}% (Below 75%)`
    });
  } else {
    res.json({ status: "Good", message: "✅ Attendance is safe" });
  }
});

/* ================= USER TEST ================= */

app.get('/add-test-student', async (req, res) => {
  try {
    const testUser = new User({
      name: "Ipsita",
      email: "ipsita@universe.com",
      rollNo: "UNI101",
      password: "password123"
    });

    await testUser.save();
    res.send("🎉 Test user added!");
  } catch (err) {
    res.status(500).send("❌ Error: " + err.message);
  }
});

/* ================= MOOD API ================= */

app.post('/api/mood', async (req, res) => {
  try {
    const { userId, rating, note } = req.body;

    const newMood = new Mood({
      user: userId,
      rating,
      note
    });

    await newMood.save();

    let suggestion = "😊 Keep up the good work!";

    if (rating <= 2) {
      suggestion = "🔥 Burnout Risk: Take a break or talk to someone.";
    } else if (rating === 3) {
      suggestion = "😐 You're okay, but take care of yourself.";
    }

    res.json({
      message: "Mood logged!",
      recommendation: suggestion
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================= ATTENDANCE API ================= */

app.post('/api/attendance', async (req, res) => {
  try {
    const { userId, subject, status } = req.body;

    const newRecord = new Attendance({
      user: userId,
      subject,
      status
    });

    await newRecord.save();

    // Calculate attendance %
    const total = await Attendance.countDocuments({ user: userId, subject });
    const present = await Attendance.countDocuments({
      user: userId,
      subject,
      status: 'Present'
    });

    const percent = (present / total) * 100;

    let alert = percent < 75
      ? "⚠️ Low Attendance!"
      : "✅ Attendance Safe";

    res.json({
      message: "Attendance saved!",
      percentage: percent.toFixed(2) + "%",
      status: alert
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================= DASHBOARD API (MAIN FEATURE) ================= */

app.get('/api/dashboard', async (req, res) => {
  try {
    const userId = "test123"; // temporary

    // Attendance
    const attendance = await Attendance.find({ user: userId });
    const total = attendance.length;
    const present = attendance.filter(a => a.status === "Present").length;
    const percent = total ? (present / total) * 100 : 0;

    // Mood
    const moods = await Mood.find({ user: userId });
    const lastMood = moods[moods.length - 1];

    let moodStatus = "😊 Good";
    if (lastMood && lastMood.rating <= 2) {
      moodStatus = "🔥 Burnout Risk";
    }

    res.json({
      attendance: percent.toFixed(2) + "%",
      mood: moodStatus
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================= START SERVER ================= */

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
// ================= LOGIN =================

app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const user = new User({ name, email, password });
    await user.save();

    res.json({ message: "User registered" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, password });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.json({ userId: user._id });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
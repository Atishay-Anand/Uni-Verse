const mongoose = require('mongoose');

const MoodSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    note: { type: String },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Mood', MoodSchema);
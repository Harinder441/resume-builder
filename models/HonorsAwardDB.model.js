const mongoose = require('mongoose');

const honorsAwardSchema = new mongoose.Schema({
  summary: { type: String, required: true },
  // Add other fields for honors and awards
});

const HonorsAwardDB = mongoose.model('HonorsAwardDB', honorsAwardSchema);

module.exports = HonorsAwardDB;

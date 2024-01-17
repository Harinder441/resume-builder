 
const mongoose = require('mongoose');

const syncSchema = new mongoose.Schema({
  lastSyncDate: { type: Date, default: Date.now },
  // Add other fields for sync info
});

const Sync = mongoose.model('Sync', syncSchema);

module.exports = Sync;

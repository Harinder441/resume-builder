const mongoose = require('mongoose');

const SyncMappingSchema = new mongoose.Schema({
  modelName: {
    type: String,
    required: true,
    unique: true,
  },
  columnMapObject: {
    type: Object,
    required: true,
  },
  NotionDBId: {
    type: String,
    required: true,
  },
});

const SyncMapping = mongoose.model('SyncMapping', SyncMappingSchema);

module.exports = SyncMapping;

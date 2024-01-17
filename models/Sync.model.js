 
const mongoose = require('mongoose');

const syncSchema = new mongoose.Schema({
  totalRowSynced:{type:Number},
  syncMessage:{type:String},
},{timestamps:true});

const Sync = mongoose.model('Sync', syncSchema);

module.exports = Sync;

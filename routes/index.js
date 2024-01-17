const express = require("express");
const syncMappingRoutes = require('./sync.route');
const notionRoutes = require('./notion.route');

const router = express.Router();


app.use('/sync-mapping', syncMappingRoutes);
app.use('/notion', notionRoutes);

module.exports = router;

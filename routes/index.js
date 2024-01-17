const express = require("express");
const syncMappingRoutes = require('./sync.route');
const notionRoutes = require('./notion.route');

const router = express.Router();


router.use('/sync-mapping', syncMappingRoutes);
router.use('/notion', notionRoutes);

module.exports = router;

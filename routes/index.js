const express = require("express");
const syncMappingRoutes = require('./sync.route');
const notionRoutes = require('./notion.route');
const resumeRoutes = require('./resume.route');

const router = express.Router();


router.use('/sync-mapping', syncMappingRoutes);
router.use('/notion', notionRoutes);
router.use('/resume', resumeRoutes);

module.exports = router;

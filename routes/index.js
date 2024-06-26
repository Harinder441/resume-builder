const express = require("express");
const syncMappingRoutes = require('./sync.route');
const notionRoutes = require('./notion.route');
const resumeRoutes = require('./resume.route');
const erpIssuesRoutes = require('./erpIssues.route');
const jiraIssuesRoutes = require('./jiraIssues.route');

const router = express.Router();


router.use('/sync-mapping', syncMappingRoutes);
router.use('/notion', notionRoutes);
router.use('/resume', resumeRoutes);
router.use('/erp-issues', erpIssuesRoutes);
router.use('/jira-issues', jiraIssuesRoutes);

module.exports = router;

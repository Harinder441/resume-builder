const express = require('express');
const router = express.Router();
const controller = require('../controllers/jiraIssues.controller');

router.post('/getIssues', controller.getIssues);
router.get('/jiraSyncNotionDB', controller.jiraSyncNotionDB);




module.exports = router;
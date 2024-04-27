const express = require('express');
const router = express.Router();
const controller = require('../controllers/jiraIssues.controller');

router.post('/getIssues', controller.getIssues);




module.exports = router;
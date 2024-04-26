const express = require('express');
const router = express.Router();
const erpIssuesController = require('../controllers/erpIssues.controller');

router.get('/getRowByIndex/:row_index', erpIssuesController.getRowByIndex);
router.get('/getIssues', erpIssuesController.getIssues);
router.post('/updateStatus', erpIssuesController.updateStatus);




module.exports = router;
const express = require('express');
const router = express.Router();
const erpIssuesController = require('../controllers/erpIssues.controller');
const { cacheMiddleware, setCache } = require('../middlewares/cache');
router.get('/getRowByIndex/:row_index', erpIssuesController.getRowByIndex);
router.get('/getIssues',cacheMiddleware, erpIssuesController.getIssues);
router.post('/updateStatus', erpIssuesController.updateStatus);
router.post('/create-notion', erpIssuesController.createNotionTask);




module.exports = router;
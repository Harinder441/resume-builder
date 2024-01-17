const express = require('express');
const router = express.Router();
const notionController = require('../controllers/notion.controller');

router.get('/database-columns/:id', notionController.getDatabaseColumns);
router.get('/database-rows/:id', notionController.getDataFromDB);
router.get('/sync-data', notionController.syncNotionDataWithServer);

module.exports = router;
const express = require('express');
const router = express.Router();
const notionController = require('../controllers/notion.controller');

router.get('/database-columns/:id', notionController.getDatabaseColumns);
router.get('/database-rows/:id', notionController.getDataFromDB);
router.get('/sync-data/:modelName?', notionController.syncNotionDataWithServer);
router.get('/models-list', notionController.getNotionModelsList);
router.get('/option-list/:modelName', notionController.getOptionListForResume);

module.exports = router;
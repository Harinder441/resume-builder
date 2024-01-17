const express = require('express');
const router = express.Router();
const { getSyncMappingController, createSyncMappingController } = require('../controllers/sync.controller');

router.get('/', getSyncMappingController);
router.post('/', createSyncMappingController);

module.exports = router;
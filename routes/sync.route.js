const express = require('express');
const router = express.Router();
const { getSyncMappingController, createSyncMappingController } = require('../controllers/sync.controller');
const validate = require("../middlewares/validate");
const syncValidation = require("../validations/sync.validation");

router.get('/', getSyncMappingController);
router.post('/',validate(syncValidation.syncMap), createSyncMappingController);

module.exports = router;
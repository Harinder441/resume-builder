const express = require('express');
const router = express.Router();
const syncController = require('../controllers/sync.controller');
const validate = require("../middlewares/validate");
const syncValidation = require("../validations/sync.validation");

router.get('/', syncController.getSyncMappingController);
router.post('/',validate(syncValidation.syncMap), syncController.createSyncMappingController);
router.put('/:id', syncController.updateSyncMappingController);

module.exports = router;
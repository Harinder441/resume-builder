const express = require('express');
const router = express.Router();
const resumeController = require('../controllers/resume.controller');

router.get('/', resumeController.getAllResume);
router.get('/:id', resumeController.getResume);
router.post('/', resumeController.createResume);
router.put('/:id', resumeController.updateResume);


module.exports = router;
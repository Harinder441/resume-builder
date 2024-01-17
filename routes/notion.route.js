const express = require('express');
const router = express.Router();
const { getDatabaseColumns } = require('../controllers/notion.controller');

router.get('/database-columns/:id', getDatabaseColumns);

module.exports = router;
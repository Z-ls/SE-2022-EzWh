const express = require('express');

const router = express.Router();

const skuController = require('../controllers/skuController');

router.get('/skus', skuController.getSKUS);

module.exports = router;
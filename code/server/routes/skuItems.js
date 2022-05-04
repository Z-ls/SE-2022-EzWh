const express = require('express');
const router = express.Router();
const skuItemController = require('../controllers/skuItemController');

router.get('/skuitems', skuItemController.getSKUItems);

module.exports = router;
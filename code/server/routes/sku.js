const express = require('express');

const router = express.Router();

const skuController = require('../controllers/skuController');

router.get('/skus', skuController.getSKUS);
router.get('/skus/:id', skuController.getSingleSKU);

router.post('/sku', skuController.addSKU);

router.put('/sku/:id', skuController.editSKU);
router.put('/sku/:id/position', skuController.editSKUPosition);

router.delete('/skus/:id', skuController.deleteSKU);

module.exports = router;
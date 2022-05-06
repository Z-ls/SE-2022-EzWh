const express = require('express');
const router = express.Router();
const skuItemController = require('../controllers/skuItemController');

router.get('/skuitems', skuItemController.getSKUItems);
router.get('/skuitems/sku/:id',skuItemController.getSKUsBySKUId);
router.get('/skuitems/:rfid', skuItemController.getSingleSKUItem);

router.post('/skuitem', skuItemController.addSKUItem);

router.put('/skuitems/:rfid', skuItemController.editSKUItem);

router.delete('/skuitems/:rfid', skuItemController.deleteSKUItem);

module.exports = router;
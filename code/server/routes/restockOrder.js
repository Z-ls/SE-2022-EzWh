const express = require('express');
const restockOrderController = require('../controllers/restockOrderController');
const router = express.Router();

const roc = new restockOrderController();

router.get('/restockOrders/:id', roc.getRestockOrder);
router.get('/restockOrders', roc.getAll);
router.get('/restockOrdersIssued', roc.getAllIssued);
router.get('/restockOrders/:id/returnItems', roc.returnItems);
router.post('/restockOrder', roc.add);
router.put('/restockOrder/:id', roc.updateState);
router.put('/restockOrder/:id/skuItems', roc.addSKUItems);
router.put('/restockOrder/:id/transportNote', roc.addTransportNote);
router.delete('/restockOrder/:id', roc.delete);


module.exports = router;
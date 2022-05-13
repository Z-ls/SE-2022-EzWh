const express = require('express');
const restockOrderController = require('../controllers/restockOrderController');
const router = express.Router();

const roc = new restockOrderController();

router.get('/restockOrders/:id', roc.getRestockOrder);              // get a restock order
router.get('/restockOrders', roc.getAll);                           // get all the restock orders
router.get('/restockOrdersIssued', roc.getAllIssued);               // get all issued restock orders
router.get('/restockOrders/:id/returnItems', roc.returnItems);      // list all skuitems to return
router.post('/restockOrder', roc.add);                              // add a restock order
router.put('/restockOrder/:id', roc.updateState);
router.put('/restockOrder/:id/skuItems', roc.addSKUItems);
router.put('/restockOrder/:id/transportNote', roc.addTransportNote);
router.delete('/restockOrder/:id', roc.delete);


module.exports = router;
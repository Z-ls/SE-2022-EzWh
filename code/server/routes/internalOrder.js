const express = require('express');
const InternalOrderController = require('../controllers/internalOrderController');
const router = express.Router();

const ioc = new InternalOrderController();

router.get('/internalOrders', ioc.getAll);
router.get('/internalOrdersIssued', ioc.getAllIssued);
router.get('/internalOrdersAccepted', ioc.getAllAccepted);
router.get('/internalOrders/:id', ioc.get);
router.post('/internalOrders', ioc.add);
router.put('/internalOrders/:id', ioc.updateState);
router.delete('/internalOrders/:id', ioc.delete);

module.exports = router;
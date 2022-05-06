const express = require('express');
const restockOrderController = require('../controllers/restockOrderController');
const router = express.Router();
router.get('/restockOrders/:id', restockOrderController.getRestockOrder);

module.exports = router;
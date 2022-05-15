const express = require('express');
const returnController = require('../controllers/returnOrderController');
const router = express.Router();


router.get('/returnOrders', returnController.getReturnOrders);
router.get('/returnOrders/:id', returnController.getReturnOrdersByID);

router.post('/returnOrder', returnController.addReturnOrder);

router.delete('/returnOrder/:id', returnController.deleteReturnOrder);

module.exports = router;
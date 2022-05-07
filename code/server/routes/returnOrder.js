const express = require('express');

const router = express.Router();

const returnController = require('../controllers/returnOrderController');

router.get('/returnOrders', returnController.getReturnOrders);
/* router.get('/returnOrders/:id', returnController.getReturnOrderByID);

router.post('/returnOrder', returnController.addReturnOrder);

router.delete('/returnOrder/:id', returnController.deleteReturnOrder);
 */
module.exports = router;
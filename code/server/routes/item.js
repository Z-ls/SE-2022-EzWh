const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');

router.get('/items', itemController.getItems);
router.get('/items/:id', itemController.getSingleItem);

router.post('/item', itemController.addItem);

router.put('/item/:id', itemController.editItem);

router.delete('/items/:id', itemController.deleteItem);

module.exports = router;
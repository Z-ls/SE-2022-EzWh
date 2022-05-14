const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();

const uController = new userController();

router.get('/suppliers', uController.getAllSupplier);
router.get('/users', uController.getAllUser);
router.post('/newUser', uController.addUser);
router.put('/users/:username', uController.changeRights);
router.delete('/users/:username/:type', uController.delete);

module.exports = router;
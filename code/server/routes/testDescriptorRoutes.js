const express = require('express');
const router = express.Router();
const tDController = require('../controllers/testDescriptorController');

router.get('/api/testDescriptors', tDController.getTestDescriptors);
router.get('/api/testDescriptor/:id', tDController.getTestDescriptorById);
router.post('/api/testDescriptor', tDController.addTestDescriptor);
router.put('/api/testDescriptor/:id', tDController.updateTestDescriptor);
router.delete('/api/testDescriptor/:id', tDController.deleteTestDescriptor);

module.exports = router;
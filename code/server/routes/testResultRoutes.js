const express = require('express');
const router = express.Router();
const tRController = require('../controllers/testResultController');

router.get('/api/skuitems/:rfid/testResults', tRController.getTestResults);
router.get('/api/skuitems/:rfid/testResults/:id', tRController.getTestResultById);
router.post('/api/skuitems/testResult', tRController.addTestResult);
router.put('/api/skuitems/:rfid/testResult/:id', tRController.updateTestResult);
router.delete('/api/skuitems/:rfid/testResult/:id', tRController.deleteTestResult);

module.exports = router;
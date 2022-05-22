const express = require('express');
const router = express.Router();
const tRController = require('../controllers/testResultController');
const { check } = require("express-validator");

router.get('/api/skuitems/:rfid/testResults',[
        check('rfid').isNumeric().custom(value => value.length === 32),
    ], tRController.getTestResults);
router.get('/api/skuitems/:rfid/testResults/:id',[
        check('rfid').isNumeric().custom(value => value.length === 32),
        check('id').isInt({min: 1})
    ], tRController.getTestResultById);
router.post('/api/skuitems/testResult', [
        check('rfid').isNumeric().custom(value => value.length === 32),
        check('idTestDescriptor').isInt({min: 1}),
        check('Date').isDate(),
        check('Result').isBoolean()
    ], tRController.addTestResult);
router.put('/api/skuitems/:rfid/testResult/:id', [
        check('rfid').isNumeric().custom(value => value.length === 32),
        check('id').isInt({min: 1}),
        check('newIdTestDescriptor').isInt({min: 1}),
        check('newDate').isDate(),
        check('newResult').isBoolean(),
    ], tRController.updateTestResult);
router.delete('/api/skuitems/:rfid/testResult/:id', [
        check('rfid').isNumeric().custom(value => value.length === 32),
        check('id').isInt({min: 1}),
    ], tRController.deleteTestResult);

module.exports = router;
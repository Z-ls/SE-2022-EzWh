const express = require('express');
const router = express.Router();
const tDController = require('../controllers/testDescriptorController');
const { check } = require('express-validator');

router.get('/api/testDescriptors', tDController.getTestDescriptors);
router.get('/api/testDescriptors/:id',
    check('id').isInt({min: 1}),
    tDController.getTestDescriptorById);
router.post('/api/testDescriptor', [
        check('idSKU').isInt({min: 1}),
        check('name').exists().notEmpty(),
        check('procedureDescription').exists().notEmpty()
    ], tDController.addTestDescriptor);
router.put('/api/testDescriptor/:id', [
        check('id').isInt({min: 1}),
        check('newIdSKU').isInt({min: 1}),
        check('newName').exists().notEmpty(),
        check('newProcedureDescription').exists().notEmpty()
    ], tDController.updateTestDescriptor);
router.delete('/api/testDescriptor/:id',
    check('id').isInt({min: 1}),
    tDController.deleteTestDescriptor);

module.exports = router;
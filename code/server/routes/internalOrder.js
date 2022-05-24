const express = require('express');
const InternalOrderController = require('../controllers/internalOrderController');
const router = express.Router();
const { param, body, validationResult, check } = require('express-validator');
const DateHandler = require('../persistence/dateHandler');
const { possibleStates } = require('../model/internalOrder');


const ioc = new InternalOrderController();
const dateHandler = new DateHandler();

router.get('/internalOrders', ioc.getAll);
router.get('/internalOrdersIssued', ioc.getAllIssued);
router.get('/internalOrdersAccepted', ioc.getAllAccepted);
router.get('/internalOrders/:id',
  param('id').matches(/^\d+$/).toInt().isInt({ min: 1 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).end();
    }
    try {
      const result = await ioc.get(req.params.id);
      return res.status(200).json(result);
    } catch (e) {
      return res.status(e.code).end();
    }
  });

router.post('/internalOrders',
  body('issueDate').exists().isString(),
  body('customerId').exists().isInt(),
  body('state').exists().isIn(possibleStates),
  body('products').exists().isArray(),
  body('products.*.SKUId').exists().isInt({ min: 1 }),
  body('products.*.description').exists().isString(),
  body('products.*.price').exists().isNumeric(),
  async (req, res) => {
    const errors = validationResult(req);
    // Validation
    if (!errors.isEmpty() || !dateHandler.isDateAndTimeValid(req.body.issueDate)) {
      return res.status(422).end();
    }
    let result;
    try {
      result = await ioc.add(req.body);
    } catch (e) {
      result = e;
    }
    return res.status(result.code).end();
  });

router.put('/internalOrders/:id',
  param('id').matches(/^\d+$/).toInt().isInt({ min: 1 }),
  body('newState').exists().isIn(possibleStates),
  body('products').optional().isArray(),
  body('products.*.SkuID').isInt(),
  body('products.*.RFID').isLength({ min: 32, max: 32 }).matches(/^\d+$/),

  async (req, res) => {
    const errors = validationResult(req);
    // Validation
    if (!errors.isEmpty() || (req.body.newState === 'COMPLETED' && !Array.isArray(req.body.products))) {
      return res.status(422).end();
    }
    let result;
    try {
      result = await ioc.updateState(req.params.id, req.body);
    } catch (e) {
      result = e;
    }
    return res.status(result.code).end();

  });

router.delete('/internalOrders/:id',
  param('id').matches(/^\d+$/).toInt().isInt({ min: 1 }),
  async (req, res) => {
    const errors = validationResult(req);
    // Validation
    if (!errors.isEmpty())
      return res.status(422).end();
    let result;
    try {
      result = await ioc.delete(req.params.id);
    } catch (e) {
      result = e;
    }
    return res.status(result.code).end();
  });

module.exports = router;
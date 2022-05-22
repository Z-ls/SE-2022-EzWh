const express = require('express');
const restockOrderController = require('../controllers/restockOrderController');
const router = express.Router();
const { param, body, validationResult, check } = require('express-validator');
const DateHandler = require('../persistence/dateHandler');
const { possibleStates } = require('../model/restockOrder');
const dayjs = require('dayjs');

const roc = new restockOrderController();
const dateHandler = new DateHandler();

router.get('/restockOrders/:id',
  param('id').matches(/^\d+$/).toInt().isInt({ min: 1 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).end();
    }
    let result;
    try {
      result = await roc.getRestockOrder(req.params.id);
      return res.status(result.code).json(result.data);
    }
    catch (e) {
      return res.status(e.code).end();
    }
  });

router.get('/restockOrders', roc.getAll);                           // get all the restock orders
router.get('/restockOrdersIssued', roc.getAllIssued);               // get all issued restock orders
router.get('/restockOrders/:id/returnItems',
  param('id').matches(/^\d+$/).toInt().isInt({ min: 1 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).end();
    }

    try {
      const result = await roc.returnItems(req.params.id);
      return res.status(result.code).json(result.data);
    }
    catch (e) {
      return res.status(e.code).end();
    }
  }
);

router.post('/restockOrder',
  body('issueDate').exists(),
  body('products').exists().isArray(),
  body('products.*.SKUId').exists().isInt(),
  body('products.*.qty').exists().isInt(),
  body('products.*.price').exists().isNumeric(),
  body('products.*.description').exists().isString(),
  body('supplierId').exists().isInt(),
  async (req, res) => {
    // validation stuff
    const errors = validationResult(req);
    if (!errors.isEmpty() || !dateHandler.isDateAndTimeValid(req.body.issueDate))
      return res.status(422).end();
    let result;
    try {
      result = await roc.add(req.body);
    } catch (e) {
      result = e;
    }
    return res.status(result.code).end();
  });

router.put('/restockOrder/:id',
  param('id').matches(/^\d+$/).toInt().isInt({ min: 1 }),
  body('newState').exists().isString(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty() || !possibleStates.includes(req.body.newState))
      return res.status(422).end();
    let result;
    try {
      result = await roc.updateState(req.params.id, req.body.newState);
    } catch (e) {
      result = e;
    }
    return res.status(result.code).end();
  });

router.put('/restockOrder/:id/skuItems',
  param('id').matches(/^\d+$/).toInt().isInt({ min: 1 }),
  body('skuItems').exists().isArray(),
  body('skuItems.*.SKUId').exists().isInt(),
  body('skuItems.*.rfid').exists().isLength({ min: 32, max: 32 }).matches(/^\d+$/),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).end();
    let result;
    try {
      result = await roc.addSKUItems(req.params.id, req.body.skuItems);
    } catch (e) {
      result = e;
    }
    return res.status(result.code).end();

  });
  
router.put('/restockOrder/:id/transportNote',
  param('id').matches(/^\d+$/).toInt().isInt({ min: 1 }),
  body('transportNote.deliveryDate').exists().isString(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty() || !dateHandler.isDateValid(req.body.transportNote.deliveryDate))
      return res.status(422).end();
    let result;
    try {
      result = await roc.addTransportNote(req.params.id, req.body.transportNote.deliveryDate);
    } catch (e) {
      result = e;
    }
    return res.status(result.code).end();
  });
router.delete('/restockOrder/:id', roc.delete);


module.exports = router;
const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();
const { param, body, validationResult, check } = require('express-validator');
const { possibleTypes } = require('../model/user');

const uController = new userController();

router.get('/suppliers', uController.getAllSupplier);
router.get('/users', uController.getAllUser);

router.post('/newUser',
  body('username').exists().isEmail(),
  body('name').exists().isString(),
  body('surname').exists().isString(),
  body('password').exists().isString().isLength({ min: 8 }),
  body('type').exists().isIn(possibleTypes),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).end();
    }
    let result;
    try { result = await uController.addUser(req.body); }
    catch (e) { result = e; }
    return res.status(result.code).end();
  });

router.put('/users/:username',
  param('username').exists().isEmail(),
  body('oldType').exists().isIn(possibleTypes),
  body('newType').exists().isIn(possibleTypes),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).end();
    }
    let result;
    try {
      result = await uController.changeRights(req.params.username, req.body.oldType, req.body.newType);
    } catch (e) {
      result = e;
    }
    return res.status(result.code).end();
  });

router.delete('/users/:username/:type',
  param('username').exists().isEmail(),
  param('type').exists().isIn(possibleTypes),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).end();
    }
    let result;
    try {
      result = await uController.delete(req.params.username, req.params.type);
    } catch (e) {
      result = e;
    }
    return res.status(result.code).end();
  });

router.get('/userinfo', uController.return200);

module.exports = router;
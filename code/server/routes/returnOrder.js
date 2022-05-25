const express = require('express');
const returnController = require('../controllers/returnOrderController');
const {param, body, validationResult} = require('express-validator');
const router = express.Router();
const DateHandler = require('../persistence/dateHandler');
const dayjs = require('dayjs');

const dateHandler = new DateHandler();

router.get('/returnOrders', 
async(req, res) => {
    try{
        let returns = await returnController.getReturnOrders()
        return res.status(200).json(returns);
    }catch(error){
        return res.status(500).send(error);
    }
});

router.get('/returnOrders/:id', 
param('id').matches(/^\d+$/).toInt().isInt({min : 1}),
async(req, res) => {
    try{
        let returns = await returnController.getReturnOrdersByID(req.params.id)
        return res.status(200).json(returns);
    }catch(error){
        return res.status(500).send(error);
    }
});

router.post('/returnOrder',
body('returnDate').exists(),
body('products').exists().isArray(),
body('restockOrderId').exists().isInt({min : 1}),
async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty() || !dateHandler.isDateAndTimeValid(req.body.returnDate)) {
        return res.status(422).send("Unprocessable entity");
    } 
    try{
        const deleted = await returnController.addReturnOrder(req.body);
        return deleted ? res.status(201).send('return Order Added') : res.status(404).send('Unprocessable Entity');
    }catch(error){
        return res.status(503).send(error);
    }
});

router.delete('/returnOrder/:id',
param('id').matches(/^\d+$/).toInt().isInt({min : 1}),
async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).send("Unprocessable entity");
    } 
    try{
        const deleted = await returnController.deleteReturnOrder(req.params.id);
        return deleted ? res.status(204).send('Deleted') : res.status(422).send('Unprocessable Entity');
    }catch(error){
        return res.status(503).send(error);
    }
});

module.exports = router;
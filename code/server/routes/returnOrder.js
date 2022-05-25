const express = require('express');
const returnController = require('../controllers/returnOrderController');
const {param, body, validationResult} = require('express-validator');
const router = express.Router();
const DateHandler = require('../persistence/dateHandler');
const dayjs = require('dayjs');

const dateHandler = new DateHandler();

router.get('/returnOrders', async(req, res) => {
    try{
        const returns = await returnController.getReturnOrders()
        let message = returns
        return res.status(200).json(message);
    }catch(error){
        return res.status(500).send(error);
    }
});

router.get('/returnOrders/:id', 
param('id').matches(/^\d+$/).toInt().isInt({min : 1}),
async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).send("Unprocessable entity");
    }
    try{
        const retres = await returnController.getReturnOrdersByID(req.params.id)
        if(retres !== undefined)
        {
            return res.status(200).json(retres);
        }else{
            message = "no Return Order associated to id " + req.params.id;
            return res.status(404).json(message);
        }
    } catch(error){
        return res.status(500).send(error);
    }
});

router.post('/returnOrder', 
async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty() || !dateHandler.isDateAndTimeValid(req.body.returnDate)) {
        return res.status(422).send("Unprocessable entity");
    } 
    try{
        const deleted = await returnController.addReturnOrder(req.body);
        return deleted ? res.status(204).send('Deleted') : res.status(422).send('Unprocessable Entity');
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
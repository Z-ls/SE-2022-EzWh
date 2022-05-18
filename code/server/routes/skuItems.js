const express = require('express');
const router = express.Router();
const {param, body, validationResult} = require('express-validator');
const skuItemController = require('../controllers/skuItemController');
const dateHandler = require('../persistence/dateHandler');

router.get('/skuitems', 
async(req, res) => {
    try{
        let message = await skuItemController.getSKUItems();
        return res.status(200).json(message);
    }catch(error){
        return res.status(500).send(error);
    }
});

router.get('/skuitems/sku/:id',
param('id').matches(/^\d+$/).toInt().isInt({min : 1}),
async(req, res) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).send("Unprocessable entity");
    }
    try{
            let skuItems = await skuItemController.getSKUsBySKUId(req.params.id);
            return skuItems.length !== 0 ? res.status(200).json(message) : res.status(404).send();  
    }catch(error){
        return res.status(500).send(error);
    }
});

router.get('/skuitems/:rfid', 
param('rfid').exists().isLength({min: 32, max:32}).matches(/^\d+$/),
async(req, res) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).send("Unprocessable entity");
    }
    try{
        let skuItem = await skuItemController.getSingleSKUItem(req.params.rfid);
        return skuItem !== undefined ? res.status(200).json(skuItem) : res.status(404).send();
    }catch(error){
        return res.status(500).send(error);
    }
});

router.post('/skuitem', 
body('RFID').exists().isLength({min: 32, max:32}).matches(/^\d+$/),
body('SKUId').exists().matches(/^\d+$/).toInt().isInt({min : 1}),
body('DateOfStock').exists(),
async(req, res) =>{
    const errors = validationResult(req);
    if (errors.isEmpty() && (req.body.DateOfStock === null|| new dateHandler().isDateValid(req.body.DateOfStock) ||  new dateHandler().isDateAndTimeValid(req.body.DateOfStock))) {
        try{
            let message = await skuItemController.addSKUItem(req.body);
            return message ? res.status(201).send() : res.status(404).send();
        }catch(error){
            return res.status(503).send(error);
        }
    }
    return res.status(422).send("Unprocessable entity"); 
});

router.put('/skuitems/:rfid',
param('rfid').exists().isLength({min: 32, max:32}).matches(/^\d+$/),
body('newRFID').exists().isLength({min: 32, max:32}).matches(/^\d+$/),
body('newAvailable').exists().matches(/^\d$/).toInt().isInt({min : 0, max : 1}),
body('newDateOfStock').exists(), 
async(req, res) =>{
    const errors = validationResult(req);
    if (errors.isEmpty() && (req.body.newDateOfStock === null|| new dateHandler().isDateValid(req.body.newDateOfStock) ||  new dateHandler().isDateAndTimeValid(req.body.newDateOfStock))) {
        try{
            let message = await skuItemController.editSKUItem(req.body, req.params.rfid);
            return message ? res.status(200).send() : res.status(404).send();
        }catch(error){
            return res.status(503).send(error);
        }
    }
    return res.status(422).send("Unprocessable entity");
});

router.delete('/skuitems/:rfid',
param('rfid').exists().isLength({min: 32, max:32}).matches(/^\d+$/), 
async(req, res) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).send("Unprocessable entity");
    }
    try{
        let message = await skuItemController.deleteSKUItem(req.params.rfid);
        return message ? res.status(204).send() : res.status(422).send();
    }catch(error){
        return res.status(503).send(error);
    }
}
);

module.exports = router;
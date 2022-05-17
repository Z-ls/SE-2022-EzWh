const express = require('express');

const router = express.Router();
const {param, body, validationResult} = require('express-validator');

const skuController = require('../controllers/skuController');

router.get('/skus', async(req, res) => {
    try{
        const skus = await skuController.getSKUS()
        let message = skus
        return res.status(200).json(message);
    }catch(error){
        return res.status(500).send(error);
    }
});

router.get('/skus/:id',
param('id').matches(/^\d+$/).toInt().isInt({min : 1}),
async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).send("Unprocessable entity");
    }
    try{
        const skuFound = await skuController.getSingleSKU(req.params.id)
        if(skuFound !== undefined)
        {
            return res.status(200).json(skuFound);
        }else{
            message = "no SKU associated to id " + req.params.id;
            return res.status(404).json(message);
        }
    } catch(error){
        return res.status(500).send(error);
    }
});

router.post('/sku',
body('description').exists(),
body('weight').exists().toFloat().isFloat({gt : 0}),
body('volume').exists().toFloat().isFloat({gt : 0}),
body('notes').exists(),
body('price').exists().toFloat().isFloat({gt : 0}),
body('availableQuantity').exists().toInt().isInt({min : 0}),
async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).send("Unprocessable entity");
    } 
    try{
        const created = await skuController.addSKU(req.body);
        return created ? res.status(201).send('Created') : res.status(422).send('Unprocessable Entity');
    }catch(error){
        return res.status(503).send(error);
    }
});

router.put('/sku/:id',
param('id').matches(/^\d+$/).toInt().isInt({min : 1}),
body('newDescription').exists(),
body('newWeight').exists().toFloat().isFloat({gt : 0}),
body('newVolume').exists().toFloat().isFloat({gt : 0}),
body('newNotes').exists(),
body('newPrice').exists().toFloat().isFloat({gt : 0}),
body('newAvailableQuantity').exists().toInt().isInt({min : 0}), 
async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).send("Unprocessable entity");
    } 
    try{
        const code = await skuController.editSKU(req.body, req.params.id);
        return res.status(code).send();
    }catch(error){
        return res.status(503).send(error);
    }
});

router.put('/sku/:id/position', 
param('id').matches(/^\d+$/).toInt().isInt({min : 1}),
body('position').exists().matches(/^\d+$/).isLength({min : 12, max : 12}),
async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).send("Unprocessable entity");
    } 
    try{
        const code = await skuController.editSKUPosition(req.body.position, req.params.id);
        return res.status(code).send();       
    }catch(error){
        return res.status(503).send(error);
    }
});

router.delete('/skus/:id',
param('id').matches(/^\d+$/).toInt().isInt({min : 1}),
async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).send("Unprocessable entity");
    } 
    try{
        const deleted = await skuController.deleteSKU(req.params.id);
        return deleted ? res.status(204).send('Deleted') : res.status(422).send('Unprocessable Entity');
    }catch(error){
        return res.status(503).send(error);
    }
});

module.exports = router;
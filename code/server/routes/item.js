const express = require('express');
const router = express.Router();
const {param, body, validationResult} = require('express-validator');
const itemController = require('../controllers/itemController');

router.get('/items', async(req, res) => {
    try{
    let message = await itemController.getItems();
    return res.status(200).json(message);
    }catch(error){
        return res.status(500).send(error);
    }
});
router.get('/items/:id/:supplierId',
param('id').matches(/^\-*\d+$/).toInt(),
param('supplierId').matches(/^\-*\d+$/).toInt(), 
async(req,res) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).send("Unprocessable entity");
    }
    try{
        let item = await itemController.getSingleItem(req.params.id,req.params.supplierId);
        return item !== undefined ? res.status(200).json(item) : res.status(404).send();
    }catch(error){
        return res.status(500).send(error);
    }
});

router.post('/item',
body('id').matches(/^\-*\d+$/).toInt(),
body('description').exists(),
body('price').exists().toFloat().isFloat({gt : 0}),
body('SKUId').matches(/^\d+$/).toInt().isInt({min : 1}),
body('supplierId').matches(/^\-*\d+$/).toInt(),
async(req, res) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).send("Unprocessable entity");
    }
    try{
        let code = await itemController.addItem(req.body);
        return res.status(code).send();
    }catch(error){
        return res.status(503).send(error);
    }
});

router.put('/item/:id/:supplierId',
param('id').matches(/^\-*\d+$/).toInt(),
param('supplierId').matches(/^\-*\d+$/).toInt(),
body('newDescription').exists(),
body('newPrice').exists().toFloat().isFloat({gt : 0}),
async(req, res) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).send("Unprocessable entity");
    }
    try{
        let message = await itemController.editItem(req.body, req.params.id, req.params.supplierId);
        return message ? res.status(200).send() : res.status(404).send();
    }catch(error){
        return res.status(503).send(error);
    }
});

router.delete('/items/:id/:supplierId', 
param('id').matches(/^\-*\d+$/).toInt(),
param('suppierId').matches(/^\-*\d+$/).toInt(),
async(req, res) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).send("Unprocessable entity");
    }
    try{
        let deleted = await itemController.deleteItem(req.params.id, req.params.supplierId);
        return deleted ? res.status(204).send() : res.status(422).send();
    }catch(error){
        return res.status(503).send(error);
    }
});

module.exports = router;
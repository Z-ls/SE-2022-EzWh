const express = require('express');

const router = express.Router();
const {param, body, validationResult} = require('express-validator');

const posController = require('../controllers/positionController');

router.get('/positions', async(req, res) => {
    try{
        let message = await posController.getPositions();
        return res.status(200).json(message);
    }catch(error){
        return res.status(500).send(error);
    }});

router.post('/position', 
body('positionID').exists().isLength({min : 12, max : 12}),
body('aisleID').exists().isLength({min : 4, max : 4}),
body('row').exists().isLength({min : 4, max : 4}),
body('col').exists().isLength({min : 4, max : 4}),
body('maxWeight').exists().toFloat().isFloat({gt : 0}),
body('maxVolume').exists().toFloat().isFloat({gt : 0}),
async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).send("Unprocessable entity");
    }
    try{
    const added = await posController.addPosition(req.body)
    if(added !== undefined)
        {
            return res.status(201).json(added);
        }else{
            message = "invalid position ID" + req.body.positionID;
            return res.status(422).json(message);
        }
    }catch(error){
        return res.status(503).send(error);  
    }
});

router.put('/position/:positionID', 
param('positionID').matches(/^\d+$/).isLength({min : 12, max : 12}),
body('newAisleID').exists().isLength({min : 4, max : 4}),
body('newRow').exists().isLength({min : 4, max : 4}),
body('newCol').exists().isLength({min : 4, max : 4}),
body('newMaxWeight').exists().toFloat().isFloat({gt : 0}),
body('newMaxVolume').exists().toFloat().isFloat({gt : 0}),
async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).send("Unprocessable entity");
    }
    try{
        const code=posController.editPosition(req.body, req.params.positionID);
        return res.status(code).send();
    }catch(error){
        return res.status(503).send(error);
    }}
    );

router.put('/position/:positionID/changeID',
param('positionID').matches(/^\d+$/).isLength({min : 12, max : 12}),
body('newPositionID').matches(/^\d+$/).isLength({min : 12, max : 12}),
async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).send("Unprocessable entity");
    }
    try{
        const editID=posController.editPositionID(req.body, req.params.positionID);
        return res.status(editID).send();
    }catch(error){
        return res.status(503).send(error);
    }}
);

router.delete('/position/:positionID', 
param('positionID').matches(/^\d+$/).isLength({min : 12, max : 12}),
async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).send("Unprocessable entity");
    } 
    try{
        const deleted = await posController.deletePosition(req.params.positionID);
        return deleted ? res.status(204).send('Deleted') : res.status(422).send('Unprocessable Entity');
    }catch(error){
        return res.status(503).send(error);
    }
});

module.exports = router;
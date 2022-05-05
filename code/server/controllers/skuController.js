const SKU = require("../model/sku");
const skuRepository = require("../persistence/skuRepository");

const getSKUS = async(req, res) => {
    const skuRep = new skuRepository();
    const skus = await skuRep.getSKUS();
    let message = skus
    return res.status(200).json(message);
}

const getSingleSKU = async (req, res) => {
    const skuRep = new skuRepository();
    const skuFound = await skuRep.getSkuById(req.params.id);
    let message;
    if(skuFound.length !== 0)
    {
        message = skuFound[0];
        return res.status(200).json(message);
    }else{
        message = "no SKU associated to id " + req.params.id;
        return res.status(404).json(message);
    }
    
}

const addSKU = async (req, res) => {
    const skuRep = new skuRepository();
    const created = await skuRep.addSKU(req.body);
    return created ? res.status(201).send('Created') : res.status(422).send('Unprocessable Entity');
}

const editSKU = async (req, res) => {
    const skuRep = new skuRepository();
    //TODO : Check if new AvailableQuantity fix into the current position (weight or volume max capability)
    const modified = await skuRep.editSKU(req.body, req.params.id);
    return modified ? res.status(200).send('Success') : res.status(404).send();
}

const editSKUPosition = async (req, res) => {
    const skuRep = new skuRepository();
    const skuFound = await skuRep.getSkuById(req.params.id);
    let message;
    if(skuFound.lenght === 0)
    {
        message = "no SKU associated to id " + req.params.id;
        return res.status(404).end(message);
    }else{
        //TODO check if position exists
        if(skuFound.position === req.body.position){
            message = "Position already assigned to SKU";
            return res.status(422).end(message);
        }else{
            //TODO : Validation of position and Check if new position is cabable to satisfy the current avaiablequantity
            const modified = await skuRep.editSKUPosition(req.body.position, req.params.id);
            return modified ? res.status(200).send('Success') : res.status(404).send();
        } 
    }
}

const deleteSKU = async (req, res) => {
    const skuRep = new skuRepository();
    const deleted = await skuRep.deleteSKU(req.params.id);
    return deleted ? res.status(204).send('Deleted') : res.status(422).send('Unprocessable Entity');
}

module.exports = {
    getSKUS,
    getSingleSKU,
    addSKU,
    editSKU,
    editSKUPosition,
    deleteSKU
};
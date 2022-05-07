const SKU = require("../model/sku");
const skuRepository = require("../persistence/skuRepository");
const positionRepository = require("../persistence/positionRepository");

const getSKUS = async(req, res) => {
    const skuRep = new skuRepository();
    /* await skuRep.dropTable();
    await skuRep.newTableSKU(); */
    const skus = await skuRep.getSKUS();
    //TODO get test descriptors associated to SKU
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
    const posRep = new positionRepository();
    if(req.body.newDescription !== undefined && req.body.newWeight !== undefined  && req.body.newVolume !== undefined  && req.body.newNotes !== undefined  && req.body.newPrice !== undefined  && req.body.newAvailableQuantity !== undefined){
        let skuFound = await skuRep.getSkuById(req.params.id);
        if(skuFound.length !== 0)
        {
            const position = await posRep.getPOSbyID(skuFound[0].position);
            if(req.body.newWeight <= position[0].maxWeight && req.body.newVolume <= position[0].maxVolume)
            {
                const modified = await skuRep.editSKU(req.body, req.params.id);
                return modified ? res.status(200).send('Success') : res.status(404).send();
            }
            return res.status(422).send("Unprocessable entity");
        }
        return res.status(404).send();
    }
    return res.status(422).send("Unprocessable entity");
}

const editSKUPosition = async (req, res) => {
    const skuRep = new skuRepository();
    const posRep = new positionRepository();
    if(req.body.position !== undefined){
        const skuFound = await skuRep.getSkuById(req.params.id);
        let message;
        if(skuFound.length === 0)
        {
            message = "no SKU associated to id " + req.params.id;
            return res.status(404).send(message);
        }else{
            const position = await posRep.getPOSbyID(req.body.position);
            if(position.length !==0){
                if(skuFound[0].position === req.body.position){
                    message = "Position already assigned to SKU";
                    return res.status(422).send(message);
                }else{
                    if(skuFound[0].weight <= position[0].maxWeight && skuFound[0].volume <= position[0].maxVolume)
                    {
                        const modified = await skuRep.editSKUPosition(req.body.position, req.params.id);
                        return modified ? res.status(200).send('Success') : res.status(404).send();
                    }
                    return res.status(422).send("Unprocessable entity");
                } 
            }
            return res.status(404).send("Not found");
        }
    }
    return res.status(422).send("Unprocessable entity");
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
const dayjs = require('dayjs');
const skuItemRepository = require("../persistence/skuItemRepository");
const skuRepository = require("../persistence/skuRepository");


const getSKUItems = async(req, res) => {
    const skuItemRep= new skuItemRepository();
    try{
        /*await skuItemRep.dropTable();
        await skuItemRep.newTableSKUItem(); */
        let message = await skuItemRep.getSKUItems();
        return res.status(200).json(message);
    }catch(error){
        return res.status(500).send(error);
    }
}

const getSKUsBySKUId = async(req, res) =>{
    const skuItemRep = new skuItemRepository();
    const skuRep = new skuRepository();
    try{
        const skuFound = await skuRep.getSkuById(req.params.id)
        if(skuFound.length !== 0){
            let message = await skuItemRep.getSKUsBySKUId(req.params.id);
            return message.length !== 0 ? res.status(200).json(message) : res.status(404).send();
        }
        return res.status(422).send("Unprocessable entity");
    }catch{
        return res.status(500).send(error);
    }
}

const getSingleSKUItem = async(req, res) =>{
    const skuItemRep = new skuItemRepository();
    try{
        let message = await skuItemRep.getSingleSKUItem(req.params.rfid);
        return message.length !== 0 ? res.status(200).json(message[0]) : res.status(404).send();
    }catch{
        return res.status(500).send(error);
    }
}

const addSKUItem = async(req, res) =>{
    const skuItemRep = new skuItemRepository();
    if(req.body.RFID !== undefined && req.body.SKUId !== undefined && req.body.DateOfStock !== undefined){
        try{
            let message = await skuItemRep.addSKUItem(req.body);
            return message ? res.status(201).send() : res.status(404).send();
        }catch{
            return res.status(503).send(error);
        }
    }
    return res.status(422).send("Unprocessable entity");
}

const editSKUItem = async(req, res) =>{
    const skuItemRep = new skuItemRepository();
    if(req.body.newRFID !== undefined && req.body.newAvailable !== undefined && req.body.newDateOfStock !== undefined){
        try{
            let sku = await skuItemRep.getSingleSKUItem(req.params.rfid);
            if(sku.length !==0)
            {
                let message = await skuItemRep.editSKUItem(req.body, req.params.rfid);
                return message ? res.status(200).send() : res.status(422).send();
            }  
            return res.status(404).send();
        }catch{
            return res.status(503).send(error);
        }
    }
    return res.status(422).send("Unprocessable entity");
}

const deleteSKUItem = async(req, res) =>{
    const skuItemRep = new skuItemRepository();
    try{
        let sku = await skuItemRep.getSingleSKUItem(req.params.rfid);
        if(sku.length !==0){
            let message = await skuItemRep.deleteSKUItem(req.params.rfid);
            return message ? res.status(204).send() : res.status(422).send();
        }
        return res.status(422).send("Unprocessable entity");
    }catch{
        return res.status(503).send(error);
    }
}


module.exports ={
    getSKUItems,
    getSKUsBySKUId,
    getSingleSKUItem,
    addSKUItem,
    editSKUItem,
    deleteSKUItem
};
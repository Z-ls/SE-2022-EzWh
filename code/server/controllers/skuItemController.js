const dayjs = require('dayjs');
const skuItemRepository = require("../persistence/skuItemRepository");


const getSKUItems = async(req, res) => {
    const skuItemRep= new skuItemRepository();
  /*   await skuItemRep.dropTable();
    await skuItemRep.newTableSKUItem(); */
    let message = await skuItemRep.getSKUItems();
    return res.status(200).json(message);
}

const getSKUsBySKUId = async(req, res) =>{
    const skuItemRep = new skuItemRepository();
    let message = await skuItemRep.getSKUsBySKUId(req.params.id);
    return message.length !== 0 ? res.status(200).json(message) : res.status(404).send();
}

const getSingleSKUItem = async(req, res) =>{
    const skuItemRep = new skuItemRepository();
    let message = await skuItemRep.getSingleSKUItem(req.params.rfid);
    return message.length !== 0 ? res.status(200).json(message[0]) : res.status(404).send();
}

const addSKUItem = async(req, res) =>{
    const skuItemRep = new skuItemRepository();
    let message = await skuItemRep.addSKUItem(req.body);
    return message ? res.status(200).send() : res.status(404).send();
}

const editSKUItem = async(req, res) =>{
    const skuItemRep = new skuItemRepository();
    let sku = await skuItemRep.getSingleSKUItem(req.params.rfid);
    if(sku.length !==0)
    {
        let message = await skuItemRep.editSKUItem(req.body, req.params.rfid);
        return message ? res.status(200).send() : res.status(422).send();
    }  
    return res.status(404).send();
}

const deleteSKUItem = async(req, res) =>{
    const skuItemRep = new skuItemRepository();
    let message = await skuItemRep.deleteSKUItem(req.params.rfid);
    return message ? res.status(204).send() : res.status(422).send();
}


module.exports ={
    getSKUItems,
    getSKUsBySKUId,
    getSingleSKUItem,
    addSKUItem,
    editSKUItem,
    deleteSKUItem
};
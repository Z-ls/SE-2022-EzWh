const Item = require("../model/item");
const itemRepository = require("../persistence/itemRepository");

const getItems = async(req, res) => {
    const itemRep= new itemRepository();
    /* await itemRep.dropTable();
    await itemRep.newTableItem(); */
    let message = await itemRep.getItems();
    return res.status(200).json(message);
}

const getSingleItem = async(req,res) =>{
    const itemRep = new itemRepository();
    let message = await itemRep.getSingleItem(req.params.id);
    return message.length !== 0 ? res.status(200).json(message[0]) : res.status(404).send();
}

const addItem = async(req, res) =>{
    const itemRep = new itemRepository();
    let checkSupplierSell = await itemRep.getItemsBySupplierAndSKUId(req.body);
    if(checkSupplierSell.length !== 0){
        return res.status(422).send();
    }
    let message = await itemRep.addItem(req.body);
    return message ? res.status(200).send() : res.status(404).send();
}

const editItem = async(req, res) =>{
    const itemRep = new itemRepository();
    let item = await itemRep.getSingleItem(req.params.id);
    if(item.length !==0)
    {
        let message = await itemRep.editItem(req.body, req.params.id);
        return message ? res.status(200).send() : res.status(422).send();
    }  
    return res.status(404).send();
}

const deleteItem = async(req, res) =>{
    const itemRep = new itemRepository();
    let message = await itemRep.deleteItem(req.params.id);
    return message ? res.status(204).send() : res.status(422).send();
}

module.exports ={
    getItems,
    getSingleItem,
    addItem,
    editItem,
    deleteItem
}

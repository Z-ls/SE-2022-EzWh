const Item = require("../model/item");
const itemRepository = require("../persistence/itemRepository");

const getItems = async(req, res) => {
    const itemRep= new itemRepository();
    try{
    /* await itemRep.dropTable();
    await itemRep.newTableItem(); */
    let message = await itemRep.getItems();
    return res.status(200).json(message);
    }catch(error){
        return res.status(500).send(error);
    }
}

const getSingleItem = async(req,res) =>{
    const itemRep = new itemRepository();
    if(req.params.id.match(/^\d+$/) !== null){
        try{
            let message = await itemRep.getSingleItem(req.params.id);
            return message.length !== 0 ? res.status(200).json(message[0]) : res.status(404).send();
        }catch(error){
            return res.status(500).send(error);
        }
    }
    return res.status(422).send("Unprocessable entity");
}

const addItem = async(req, res) =>{
    const itemRep = new itemRepository();
    if(req.body.id !== undefined && req.body.description !== undefined && req.body.price !== undefined && req.body.SKUId !== undefined && req.body.supplierId !== undefined){
        try{
            let checkSupplierSell = await itemRep.getItemsBySupplierAndSKUId(req.body);
            if(checkSupplierSell.length !== 0){
                return res.status(422).send();
            }
            let message = await itemRep.addItem(req.body);
            return message ? res.status(201).send() : res.status(404).send();
        }catch(error){
            return res.status(503).send(error);
        }
    }
    return res.status(422).send("Unprocessable entity");
}

const editItem = async(req, res) =>{
    const itemRep = new itemRepository();
    if(req.params.id.match(/^\d+$/) !== null && req.body.newDescription !== undefined && req.body.newPrice !== undefined){
        try{
            let item = await itemRep.getSingleItem(req.params.id);
            if(item.length !==0)
            {
                let message = await itemRep.editItem(req.body, req.params.id);
                return message ? res.status(200).send() : res.status(422).send();
            }  
            return res.status(404).send();
        }catch(error){
            return res.status(503).send(error);
        }
    }
    return res.status(422).send("Unprocessable entity");
}

const deleteItem = async(req, res) =>{
    const itemRep = new itemRepository();
    try{
        let message = await itemRep.deleteItem(req.params.id);
        return message ? res.status(204).send() : res.status(422).send();
    }catch(error){
        return res.status(503).send(error);
    }
}

module.exports ={
    getItems,
    getSingleItem,
    addItem,
    editItem,
    deleteItem
}

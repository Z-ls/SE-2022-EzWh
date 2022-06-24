const Item = require("../model/item");
const itemRepository = require("../persistence/itemRepository");

const getItems = async() => {
    const itemRep= new itemRepository();
    /* await itemRep.dropTable();
    await itemRep.newTableItem(); */
    let message = await itemRep.getItems();
    return message;
}

const getSingleItem = async(id,supplierId) =>{
    const itemRep = new itemRepository();
    let item = await itemRep.getSingleItem(id,supplierId);
    return item.length !== 0 ? item[0]: undefined;

}

const addItem = async(newItem) =>{
    const itemRep = new itemRepository();
    let checkSupplierSell = await itemRep.getItemsBySupplierAndSKUId(newItem);
    if(checkSupplierSell.length !== 0){
        //Supplier sold an item with the same SKUId or with the same Id
        return 422;
    }
    let message = await itemRep.addItem(newItem);
    return message ? 201 : 404;
}

const editItem = async(newItem, id, supplierId) =>{
    const itemRep = new itemRepository();
    let item = await itemRep.getSingleItem(id, supplierId);
    if(item.length !==0)
    {
        let message = await itemRep.editItem(newItem, id, supplierId);
        return message;
    }  
    return false;
}

const deleteItem = async(id, suppierId) =>{
    const itemRep = new itemRepository();
    let deleted = await itemRep.deleteItem(id, suppierId);
    return deleted;
}

module.exports ={
    getItems,
    getSingleItem,
    addItem,
    editItem,
    deleteItem
}

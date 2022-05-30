const dayjs = require('dayjs');
const skuItemRepository = require("../persistence/skuItemRepository");
const skuRepository = require("../persistence/skuRepository");


const getSKUItems = async() => {
    const skuItemRep= new skuItemRepository();
    /*await skuItemRep.dropTable();
    await skuItemRep.newTableSKUItem(); */
    let message = await skuItemRep.getSKUItems();
    return message;
}

const getSKUsBySKUId = async(id) =>{
    const skuItemRep = new skuItemRepository();
    let skuItemsFound = await skuItemRep.getSKUsBySKUId(id);
    return skuItemsFound;
}

const getSingleSKUItem = async(rfid) =>{
    const skuItemRep = new skuItemRepository();
    let skuItems = await skuItemRep.getSingleSKUItem(rfid);
    return skuItems.length !== 0 ? skuItems[0] : undefined;
}

const addSKUItem = async(newSKUItem) =>{
    const skuItemRep = new skuItemRepository();
    let message = await skuItemRep.addSKUItem(newSKUItem);
    return message;
}

const editSKUItem = async(newSKUItem, rfid) =>{
    const skuItemRep = new skuItemRepository();
    let sku = await skuItemRep.getSingleSKUItem(rfid);
    if(sku.length !==0)
    {
        let message = await skuItemRep.editSKUItem(newSKUItem, rfid);
        return message;
    }  
    return false;
}

const deleteSKUItem = async(rfid) =>{
    const skuItemRep = new skuItemRepository();
    let message = await skuItemRep.deleteSKUItem(rfid);
    return message;
}


module.exports ={
    getSKUItems,
    getSKUsBySKUId,
    getSingleSKUItem,
    addSKUItem,
    editSKUItem,
    deleteSKUItem
};
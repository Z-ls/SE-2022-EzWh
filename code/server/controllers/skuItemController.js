const dayjs = require('dayjs');
const skuItemRepository = require("../persistence/skuItemRepository");


const getSKUItems = async(req, res) => {
    const skuItemRep= new skuItemRepository();
    let message = await skuItemRep.getSKUItems();
    return res.status(200).json(message);
}

module.exports ={
    getSKUItems
};
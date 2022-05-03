const SKU = require("../model/sku");
const skuRepository = require("../persistence/skuRepository");

async function getSKUS(req, res){
    const sku = new SKU(15,'Temporal SKU', 100,50, "First SKU", "76543",20,10.99,[1,2,3]);
    const skuRep = new skuRepository();
    console.log(await skuRep.dropTable());
    console.log(await skuRep.newTableSKU());
    console.log(await skuRep.addSKU(sku));
    console.log(await skuRep.getSKUS());
    const skus = await skuRep.getSKUS();
    let message =[skus]
        return res.status(200).json(message);
}

module.exports = {
    getSKUS
};
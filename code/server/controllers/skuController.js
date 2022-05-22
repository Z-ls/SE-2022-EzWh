const SKU = require("../model/sku");
const TestDescriptorRepository = require('../persistence/testDescriptorRepository');
const skuRepository = require("../persistence/skuRepository");
const positionRepository = require("../persistence/positionRepository");

const getSKUS = async () => {
    const skuRep = new skuRepository();
    const testDesRep = new TestDescriptorRepository()
    /* await skuRep.dropTable();
    await skuRep.newTableSKU(); */
    let skus = await skuRep.getSKUS();
    for (let index = 0; index < skus.length; index++) {
        let s = skus[index];
        s.testDescriptors = await testDesRep.getTestDescriptorIdsBySKUId(s.id);
    }
    return skus;

}

const getSingleSKU = async (id) => {
    const skuRep = new skuRepository();
    const testDesRep = new TestDescriptorRepository()
    const skuFound = await skuRep.getSkuById(id);
    if(skuFound.length !== 0){
        skuFound[0].testDescriptors = await testDesRep.getTestDescriptorIdsBySKUId(skuFound[0].id);
        return skuFound[0];
    }
    return undefined;
}

const addSKU = async (sku) => {
    const skuRep = new skuRepository();
    const created = await skuRep.addSKU(sku);
    return created;
}

const editSKU = async (newSKU, id) => {
    const skuRep = new skuRepository();
    const posRep = new positionRepository();
    let skuFound = await skuRep.getSkuById(id);
    if(skuFound.length !== 0)
    {
        const position = await posRep.getPOSbyID(skuFound[0].position);
        if(position.length !== 0){
            if(newSKU.newWeight * newSKU.newAvailableQuantity <= position[0].maxWeight && newSKU.newVolume * newSKU.newAvailableQuantity <= position[0].maxVolume)
            {
                const modified = await skuRep.editSKU(newSKU, id);
                return modified ? 200 : 404;
            }
            return 422;
        }
        const modified = await skuRep.editSKU(newSKU, id);
        return modified ? 200 : 404;
    }
    return 404;
}

const editSKUPosition = async (position, id) => {
    const skuRep = new skuRepository();
    const posRep = new positionRepository();
    const skuFound = await skuRep.getSkuById(id);
    if(skuFound.length === 0)
    {
        return 404;
    }else{
        const positionFound = await posRep.getPOSbyID(position);
        if(positionFound.length !==0){
            const skuWithPosition = await skuRep.getSKUByPosition(position);
            if(skuWithPosition.length !== 0){
                //"Position already assigned to SKU
                return 422;
            }else{
                if(skuFound[0].weight * skuFound[0].availableQuantity <= positionFound[0].maxWeight && skuFound[0].volume * skuFound[0].availableQuantity <= positionFound[0].maxVolume)
                {
                    const newPostion =  {
                        newAisleID: positionFound[0].aisleID,
                        newRow: positionFound[0].row,
                        newCol: positionFound[0].col,
                        newMaxWeight: positionFound[0].maxWeight,
                        newMaxVolume: positionFound[0].maxVolume,
                        newOccupiedWeight: skuFound[0].weight * skuFound[0].availableQuantity,
                        newOccupiedVolume: skuFound[0].volume * skuFound[0].availableQuantity
                    };
                    const modified = await skuRep.editSKUPosition(position, id);
                    const posModified = await posRep.editPOS(newPostion,position);
                    return modified && posModified ? 200 : 404;
                }
                return 422;
            } 
        }
        return 404;
    }
}

const deleteSKU = async (id) => {
    const skuRep = new skuRepository();
    const deleted = await skuRep.deleteSKU(id);
    return deleted;
}

module.exports = {
    getSKUS,
    getSingleSKU,
    addSKU,
    editSKU,
    editSKUPosition,
    deleteSKU
};
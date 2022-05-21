const internalOrderRepository = require("../persistence/internalOrderRepository");
const itemRepository = require("../persistence/itemRepository");
const positionRepository = require("../persistence/positionRepository");
const restockOrderRepository = require("../persistence/restockOrderRepository");
const returnOrderRepository = require("../persistence/returnOrderRepository");
const skuItemRepository = require("../persistence/skuItemRepository");
const skuRepository = require("../persistence/skuRepository");
const testDescriptorRepository = require("../persistence/testDescriptorRepository");
const testResultRepository = require("../persistence/testResultRepository");
const userRepository = require("../persistence/userRepository");

const interRepo = new internalOrderRepository();
const itemRepo = new itemRepository();
const posRepo = new positionRepository();
const restockRepo = new restockOrderRepository();
const returnRepo = new returnOrderRepository();
const skuItemRepo = new skuItemRepository();
const skuRepo = new skuRepository();
const testDesRepo = new testDescriptorRepository();
const testResRepo = new testResultRepository();
const userRepo = new userRepository();

function DBHandler(){

    this.deleteAllTablesData = async ()=>{
        await restockRepo.deleteRestockOrderdata();
        await interRepo.deleteInternalOrderdata();
        await returnRepo.deleteReturnOrderdata();
        await testResRepo.deleteTestResultdata();
        await testDesRepo.deleteTestDescriptordata();
        await itemRepo.deleteItemdata();
        await userRepo.deleteUserdata();
        await skuItemRepo.deleteSKUItemdata();
        await skuRepo.deleteSKUdata();
        await posRepo.deletePositiondata();
    }
}

module.exports = DBHandler;
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

    this.dropAllTables = ()=>{
        restockRepo.dropTable();
        interRepo
        returnRepo.dropTable();
        testResRepo.dropTable();
        testDesRepo.dropTable();
        itemRepo.dropTable();
        userRepo.dropTable();
        skuItemRepo.dropTable();
        skuRepo.dropTable();
        posRepo.dropTable();
    }

    this.createAllTables = () =>{
        posRepo.newTablePOS();
        skuRepo.newTableSKU();
        skuItemRepo.newTableSKUItem();
        itemRepo.newTableItem();
        userRepo.newTableUser();
        testDesRepo.newTestDescriptorTable();
        testResRepo.newTestResultTable();
        returnRepo.newTableRETURN();
        interRepo.
        restockRepo.newTable();
    }
}

module.exports = DBHandler;
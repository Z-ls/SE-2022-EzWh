const fs = require('fs');
const sqlite = require('sqlite3');
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

function DBHandler() {

    this.deleteAllTablesData = async () => {
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
        await skuRepo.deleteSequence();
    }

    this.freshDB = () => new Promise((resolve, reject) => {
        const dbPath = "../ezwh.db";
        // delete db if exists
        try {
            fs.unlinkSync(dbPath);
        } catch (err) {
            console.log("ezwh.db is not existing");
        }

        // create a new one
        const db = new sqlite.Database(dbPath, [sqlite.OPEN_READWRITE, sqlite.OPEN_CREATE], (err) => {
            if (err) {
                reject(err);
            }
        });

        // populate it
        db.run("PRAGMA foreign_keys = ON");
        try {
            const queries = fs.readFileSync('../ezwh.db.sql', 'utf8');
            db.exec(queries.toString(), err => {
                if (err) {
                    reject(err);
                }
                else {
                    db.close();
                    resolve(true);
                }
            });
        } catch (err) {
            console.error(err);
        }
    });
}

module.exports = DBHandler;
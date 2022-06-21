const Item = require("../model/item");
const skuRepository = require("../persistence/skuRepository");
const itemRepository = require("../persistence/itemRepository");
const itemController = require("../controllers/itemController");
const DBHandler = require("../persistence/DBHandler");
const userRepository = require("../persistence/userRepository");
const userRep = new userRepository();
const dbHAndler = new DBHandler();
const skuRep = new skuRepository();
const itemRep = new itemRepository();

describe('edit Item Controller',() =>{
    beforeEach(async () => {
        await dbHAndler.deleteAllTablesData();

        await userRep.add({
            username:"user1@ezwh.com",
            name:"John",
            surname : "Smith",
            password : "testpassword",
            type : "supplier"
    
        }
            );
        await skuRep.addSKU({
            description : "a new sku",
            weight : 100,
            volume : 50,
            notes : "first SKU",
            price : 10.99,
            availableQuantity : 50
                }
            );
        await itemRep.addItem({
                id : 12,
                description : "a new item",
                price : 10.99,
                SKUId : 1,
                supplierId : 1
            } );
    });

    testEditItem({newDescription : "a new item 2", newPrice : 11.99},13,1,undefined);
    testEditItem({newDescription : "a new item 2", newPrice : 11.99},12,1,new Item(12,"a new item 2",11.99,1,1));
});

async function testEditItem(newItem,id,supplierId,expected) {
    test('edit Item Controller', async () => {
        await itemController.editItem(newItem,id);
        let res = await itemController.getSingleItem(id,supplierId);
        expect(res).toEqual(expected);
    });
}

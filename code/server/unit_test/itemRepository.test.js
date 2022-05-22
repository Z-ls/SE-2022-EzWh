const Item = require("../model/Item");
const skuRepository = require("../persistence/skuRepository");
const itemRepository = require("../persistence/itemRepository");
const userRepository = require("../persistence/userRepository");
const DBHandler = require("../persistence/DBHandler");
const dbHAndler = new DBHandler();
const skuRep = new skuRepository();
const itemRep = new itemRepository();
const userRep = new userRepository();

describe('add item',() =>{
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
        await skuRep.addSKU({
            description : "a new sku 2",
            weight : 100,
            volume : 50,
            notes : "second SKU",
            price : 11.99,
            availableQuantity : 50
                }
            );
        await itemRep.addItem({
            id : 12,
            description : "a new item",
            price : 10.99,
            SKUId : 1,
            supplierId : 1
        }
            );
    });

    testAddItem({id : 12,description : "a new item 2",price : 11.99,SKUId : 1, supplierId : 1}, [new Item(12,"a new item",10.99,1,1)]);
    testAddItem({id : 12,description : "a new item 2",price : 11.99,SKUId : 1, supplierId : 3}, [new Item(12,"a new item",10.99,1,1)]);
    testAddItem({id : 13,description : "a new item 2",price : 11.99,SKUId : 3, supplierId : 1}, []);
    testAddItem({id : 13,description : "a new item 2",price : 11.99,SKUId : 2, supplierId : 1}, [new Item(13,"a new item 2",11.99,2,1)]);
});

describe('delete item',() =>{
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
        }
            );
    });

    testDeleteitem(13,[false,[]]);
    testDeleteitem(12, [true,[]]);
});

async function testAddItem(newitem,expected) {
    test('add item', async () => {
        await itemRep.addItem(newitem);
        let res = await itemRep.getSingleItem(newitem.id);
        expect(res).toEqual(expected);
    });
}

async function testDeleteitem(id,expected) {
    test('delete item', async () => {
        let res2 = await itemRep.deleteItem(id);
        let res = await itemRep.getSingleItem(id);
        expect([res2,res]).toEqual(expected);
    });
}
const Item = require("../model/Item");
const skuRepository = require("../persistence/skuRepository");
const itemRepository = require("../persistence/itemRepository");
const userRepository = require("../persistence/userRepository");
const skuRep = new skuRepository();
const itemRep = new itemRepository();
const userRep = new userRepository();

describe('add item',() =>{
    beforeEach(async () => {
        await userRep.dropTable();
        await userRep.newTableUser();
        await itemRep.dropTable();
        await itemRep.newTableItem();
        await skuRep.dropTable();
        await skuRep.newTableSKU();

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

    afterAll(async () => {
        await userRep.dropTable();
        await itemRep.dropTable();
        await skuRep.dropTable();
      });

    testAddItem({id : 12,description : "a new item 2",price : 11.99,SKUId : 1, supplierId : 1}, [new Item(12,"a new item",10.99,1,1)]);
    testAddItem({id : 12,description : "a new item 2",price : 11.99,SKUId : 1, supplierId : 3}, [new Item(12,"a new item",10.99,1,1)]);
    testAddItem({id : 13,description : "a new item 2",price : 11.99,SKUId : 3, supplierId : 1}, []);
    testAddItem({id : 13,description : "a new item 2",price : 11.99,SKUId : 2, supplierId : 1}, [new Item(13,"a new item 2",11.99,2,1)]);
});

/* describe('delete item',() =>{
    beforeEach(async () => {
        await itemRep.dropTable();
        await itemRep.newTableitem();
        await skuRep.dropTable();
        await skuRep.newTableSKU();
        await skuRep.addSKU({
            description : "a new sku",
            weight : 100,
            volume : 50,
            notes : "first SKU",
            price : 10.99,
            availableQuantity : 50
                }
            );
        await itemRep.additem({
            RFID:"12345678901234567890123456789015",
            SKUId:1,
            DateOfStock:"2021/11/29 12:30"
                }
            );
    });

    testDeleteitem("22455678901234567890123456789024",[false,[]]);
    testDeleteitem("12345678901234567890123456789015", [true,[]]);
}); */

async function testAddItem(newitem,expected) {
    test('add item', async () => {
        await itemRep.addItem(newitem);
        let res = await itemRep.getSingleItem(newitem.id);
        expect(res).toEqual(expected);
    });
}

async function testDeleteitem(rfid,expected) {
    test('delete item', async () => {
        let res2 = await itemRep.deleteitem(rfid);
        let res = await itemRep.getSingleitem(rfid);
        expect([res2,res]).toEqual(expected);
    });
}
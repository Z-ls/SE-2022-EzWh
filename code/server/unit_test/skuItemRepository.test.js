const skuItem = require("../model/skuItem");
const skuRepository = require("../persistence/skuRepository");
const skuItemRepository = require("../persistence/skuItemRepository");
const skuRep = new skuRepository();
const skuItemRep = new skuItemRepository();

describe('add SKUItem',() =>{
    beforeEach(async () => {
        await skuItemRep.dropTable();
        await skuItemRep.newTableSKUItem();
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
        await skuItemRep.addSKUItem({
            RFID:"12345678901234567890123456789015",
            SKUId:1,
            DateOfStock:"2021/11/29 12:30"
                }
            );
    });

    afterAll(async () => {
        await skuItemRep.dropTable();
        await skuRep.dropTable();
    });

    testAddSKUItem({ RFID:"12345678901234567890123456789015", SKUId:1, DateOfStock:"2020/02/28 15:30"}, [new skuItem("12345678901234567890123456789015", 1,0,"2021/11/29 12:30")]);
    testAddSKUItem({ RFID:"22455678901234567890123456789024", SKUId:2, DateOfStock:"2021/04/28 15:35"},[]);
    testAddSKUItem({ RFID:"22455678901234567890123456789024", SKUId:1, DateOfStock:"2021/04/28 15:35"},[ new skuItem("22455678901234567890123456789024",1,0,"2021/04/28 15:35")]);
});

describe('delete SKUItem',() =>{
    beforeEach(async () => {
        await skuItemRep.dropTable();
        await skuItemRep.newTableSKUItem();
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
        await skuItemRep.addSKUItem({
            RFID:"12345678901234567890123456789015",
            SKUId:1,
            DateOfStock:"2021/11/29 12:30"
                }
            );
    });

    afterAll(async () => {
        await skuItemRep.dropTable();
        await skuRep.dropTable();
    });

    testDeleteSKUItem("22455678901234567890123456789024",[false,[]]);
    testDeleteSKUItem("12345678901234567890123456789015", [true,[]]);
});

async function testAddSKUItem(newSKUItem,expected) {
    test('add SKUItem', async () => {
        await skuItemRep.addSKUItem(newSKUItem);
        let res = await skuItemRep.getSingleSKUItem(newSKUItem.RFID);
        expect(res).toEqual(expected);
    });
}

async function testDeleteSKUItem(rfid,expected) {
    test('delete SKUItem', async () => {
        let res2 = await skuItemRep.deleteSKUItem(rfid);
        let res = await skuItemRep.getSingleSKUItem(rfid);
        expect([res2,res]).toEqual(expected);
    });
}
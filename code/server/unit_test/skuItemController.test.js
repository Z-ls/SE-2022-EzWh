const skuItem = require("../model/skuItem");
const skuRepository = require("../persistence/skuRepository");
const skuItemRepository = require("../persistence/skuItemRepository");
const skuItemController = require("../controllers/skuItemController");
const skuRep = new skuRepository();
const skuItemRep = new skuItemRepository();

describe('edit SKUItem Controller',() =>{
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

    testEditSKUItem({newRFID:"22455678901234567890123456789024",newAvailable:1,newDateOfStock:"2021/11/29 12:30"},"22455678901234567890123456789024",undefined);
    testEditSKUItem({newRFID:"12345678901234567890123456789015",newAvailable:1,newDateOfStock:"2020/12/29 13:30"},"12345678901234567890123456789015",new skuItem("12345678901234567890123456789015",1,1,"2020/12/29 13:30"));
});

async function testEditSKUItem(newSKUItem,rfid,expected) {
    test('edit SKUItem Controller', async () => {
        await skuItemController.editSKUItem(newSKUItem,rfid);
        let res = await skuItemController.getSingleSKUItem(rfid);
        expect(res).toEqual(expected);
    });
}

const SKU = require("../model/sku");
const skuRepository = require("../persistence/skuRepository");
const DBHandler = require("../persistence/DBHandler");
const skuRep = new skuRepository();
const dbHAndler = new DBHandler();

describe('edit SKU',() =>{
    beforeEach(async () => {
        await dbHAndler.deleteAllTablesData();
        await skuRep.addSKU({
            description : "a new sku",
            weight : 100,
            volume : 50,
            notes : "first SKU",
            price : 10.99,
            availableQuantity : 50
                }
            );
    });

    testEditSKU({
        newDescription : "a new sku",newWeight : 100,newVolume : 50,newNotes : "first SKU",newPrice : 10.99,newAvailableQuantity : 50
    },1000,[]);
    testEditSKU({
        newDescription : "a new sku",newWeight : 100,newVolume : 50,newNotes : "first SKU",newPrice : 10.99,newAvailableQuantity : 50
    },1,[new SKU(1,"a new sku",100, 50,"first SKU", null,50, 10.99)]
	);
});

describe('edit SKU Position',() =>{
    beforeEach(async () => {
        await dbHAndler.deleteAllTablesData();
        await skuRep.addSKU({
            description : "a new sku",
            weight : 100,
            volume : 50,
            notes : "first SKU",
            price : 10.99,
            availableQuantity : 50
                }
            );
    });

    testEditSKUPosition("800234523412",1000,[]);
    testEditSKUPosition("800234523412",1,[new SKU(1,"a new sku",100, 50,"first SKU", "800234523412",50, 10.99)]
	);
});

async function testEditSKU(newSKU, id, expected) {
    test('edit SKU', async () => {
        await skuRep.editSKU(newSKU,id);
        let res = await skuRep.getSkuById(id);
        expect(res).toEqual(expected);
    });
}

async function testEditSKUPosition(position, id, expected) {
    test('edit SKU Position', async () => {
        await skuRep.editSKUPosition(position,id);
        let res = await skuRep.getSkuById(id);
        expect(res).toEqual(expected);
    });
}


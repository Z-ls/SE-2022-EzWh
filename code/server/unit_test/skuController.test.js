const SKU = require("../model/sku");
const posRepository = require("../persistence/positionRepository");
const skuRepository = require("../persistence/skuRepository");
const skuController = require("../controllers/skuController");
const posRep = new posRepository();
const skuRep = new skuRepository();

describe('edit SKU Controller',() =>{
    beforeEach(async () => {
        await skuRep.dropTable();
        await skuRep.newTableSKU();
        await posRep.dropTable()
        await posRep.newTablePOS();
        await posRep.addPOS({
            positionID:"800234543412",
            aisleID: "8002",
            row: "3454",
            col: "3412",
            maxWeight: 1000,
            maxVolume: 1000
        }
)
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
            weight : 2,
            volume : 3,
            notes : "second SKU",
            price : 11.99,
            availableQuantity : 50
                }
            );
            await skuRep.editSKUPosition("800234543412", 2);
    });
    testEditSKUController({
        newDescription : "a new sku",newWeight : 100,newVolume : 50,newNotes : "first SKU",newPrice : 10.99,newAvailableQuantity : 50
    },1000,undefined);
    testEditSKUController({
        newDescription : "a new sku",newWeight : 100,newVolume : 50,newNotes : "first SKU",newPrice : 10.99,newAvailableQuantity : 50
    },1,new SKU(1,"a new sku",100, 50,"first SKU", null,50, 10.99,[])
	);
    testEditSKUController({
        newDescription : "a new sku 2",newWeight : 100,newVolume : 50,newNotes : "second SKU",newPrice : 11.99,newAvailableQuantity : 50
    },2,new SKU(2,"a new sku 2",2, 3,"second SKU", "800234543412",50, 11.99,[])
	);
    testEditSKUController({
        newDescription : "a new sku 2",newWeight : 20,newVolume : 20,newNotes : "second SKU",newPrice : 11.99,newAvailableQuantity : 50
    },2,new SKU(2,"a new sku 2",20, 20,"second SKU", "800234543412",50, 11.99,[])
	);
});

describe('edit SKU Position Controller',() =>{
    beforeEach(async () => {
        await skuRep.dropTable();
        await skuRep.newTableSKU();
        await posRep.dropTable()
        await posRep.newTablePOS();
        await posRep.addPOS({
            positionID:"800234543412",
            aisleID: "8002",
            row: "3454",
            col: "3412",
            maxWeight: 1000,
            maxVolume: 1000
        }
        );
        await posRep.addPOS({
            positionID:"800234543413",
            aisleID: "8002",
            row: "3454",
            col: "3413",
            maxWeight: 1000,
            maxVolume: 1000
        }
        );
        await posRep.addPOS({
            positionID:"900234543417",
            aisleID: "9002",
            row: "3454",
            col: "3417",
            maxWeight: 10000,
            maxVolume: 10000
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
            weight : 2,
            volume : 3,
            notes : "second SKU",
            price : 11.99,
            availableQuantity : 50
                }
            );
        await skuRep.editSKUPosition("800234543412", 2);
    });
    testEditSKUPositionController("800234543412",1000,undefined);
    testEditSKUPositionController("900234523415",1,new SKU(1,"a new sku",100, 50,"first SKU", null,50, 10.99,[]));
    testEditSKUPositionController("800234543412",2,new SKU(2,"a new sku 2",2, 3,"second SKU", "800234543412",50, 11.99,[]));
    testEditSKUPositionController("800234543413",1,new SKU(1,"a new sku",100, 50,"first SKU", null,50, 10.99,[]));
    testEditSKUPositionController("900234543417",1,new SKU(1,"a new sku",100, 50,"first SKU", "900234543417",50, 10.99,[]));
});

async function testEditSKUController(newSKU, id, expected) {
    test('edit SKU Controller', async () => {
        await skuController.editSKU(newSKU,id);
        let res = await skuController.getSingleSKU(id);
        expect(res).toEqual(expected);
    });
}

async function testEditSKUPositionController(position, id, expected) {
    test('edit SKU Position Controller', async () => {
        await skuController.editSKUPosition(position,id);
        let res = await skuController.getSingleSKU(id);
        expect(res).toEqual(expected);
    });
}


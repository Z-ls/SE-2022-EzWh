const POS = require("../model/position");
const posRepository = require("../persistence/positionRepository");
const DBHandler = require("../persistence/DBHandler");
const posRep = new posRepository();
const dbHAndler = new DBHandler();

describe('get position by ID',() =>{
    beforeEach(async () => {
        await dbHAndler.deleteAllTablesData();
        await posRep.addPOS({
            positionID : "101020203030",
            aisleID : "1010",
            row : "2020",
            col : "3030",
            maxWeight : 1000,
            maxVolume : 100
                }
            );
    });
    testGetPOSID("101020203030", [new POS("101020203030", "1010", "2020", "3030", 1000, 100, 0, 0)]);
});


async function testGetPOSID(id, expected) {
    test('get POSITION ID', async () => {
        let res = await posRep.getPOSbyID(id);
        expect(res).toEqual(expected);
    });
}

describe('edit position ID',() =>{
    beforeEach(async () => {
        await dbHAndler.deleteAllTablesData();
        await posRep.addPOS({
            positionID : "101020203030",
            aisleID : "1010",
            row : "2020",
            col : "3030",
            maxWeight : 1000,
            maxVolume : 100
                }
            );
    });
    testEditPOSID({
        newPositionID : "111122223333"
    },"101020203030", "111122223333", [new POS("111122223333", "1111", "2222", "3333", 1000, 100, 0, 0)]);

    testEditPOSID({
        newPositionID : "111122223333"
    }, "101020203030", "111122223330",[]);
});


async function testEditPOSID(pos, id, newid, expected) {
    test('edit POSITION ID', async () => {
        await posRep.editPOSID(pos,id);
        let res = await posRep.getPOSbyID(newid);
        expect(res).toEqual(expected);
    });
}

describe('edit position by ID',() =>{
    beforeEach(async () => {
        await dbHAndler.deleteAllTablesData();
        await posRep.addPOS({
            positionID : "101020203030",
            aisleID : "1010",
            row : "2020",
            col : "3030",
            maxWeight : 1000,
            maxVolume : 100
                }
            );
    });
    testEditPOSbyID({
        newAisleID : "1111", newRow: "2222", newCol: "3333", newMaxWeight: 2000, newMaxVolume: 200, newOccupiedWeight: 1000, newOccupiedVolume: 100
    },"101020203030", "111122223333", [new POS("111122223333", "1111", "2222", "3333", 2000, 200, 1000, 100)]);
});

async function testEditPOSbyID(pos, id, newid, expected) {
    test('edit POSITION by ID', async () => {
        await posRep.editPOS(pos,id);
        let res = await posRep.getPOSbyID(newid);
        expect(res).toEqual(expected);
    });
}
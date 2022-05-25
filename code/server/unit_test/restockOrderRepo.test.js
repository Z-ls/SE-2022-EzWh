const { RestockOrder } = require('../model/restockOrder');
const SKU = require('../model/sku');
const TestDescriptor = require('../model/TestDescriptor');
const Item = require('../model/item');
const Position = require('../model/position');
const dayjs = require('dayjs');
const DateHandler = require('../persistence/dateHandler');


const dateHandler = new DateHandler();
const DBHandler = require("../persistence/DBHandler");
const skuRepository = require('../persistence/skuRepository');
const testResult = require('../model/TestResult');
const TestDescriptorRepository = require('../persistence/testDescriptorRepository');
const TestResultRepository = require('../persistence/testResultRepository');
const posRepository = require('../persistence/positionRepository');
const restockOrderRepository = require('../persistence/restockOrderRepository');
const userRepository = require('../persistence/userRepository');
const { User } = require('../model/user');
const itemRepository = require('../persistence/itemRepository');



const dbHandler = new DBHandler();
const testDescriptorRepo = new TestDescriptorRepository();
const testResultRepo = new TestResultRepository();
const restockRepo = new restockOrderRepository();
const skuRepo = new skuRepository();
const itemRepo = new itemRepository();
const positionRepo = new posRepository();
const userRepo = new userRepository();

describe('list return items of an order', () => {
  const rfid1 = "12345678901234567890123456789016";
  const rfid2 = "12345678901234567890123456789017";
  beforeEach(async () => {
    await dbHandler.deleteAllTablesData();
    await positionRepo.addPOS(new Position("800234543412", "8002", "3454", "3412", 100, 100, 0, 0));
    await skuRepo.addSKU(new SKU(1, "sku description", 2, 3, "note", "800234543412", 5, 10, [1]));
    await userRepo.add(new User(1, "Riccardo", "Salvatelli", "riccardo.salvatelli", "passwordd", "supplier"));
    await itemRepo.addItem(new Item(1, "item description", 10, 1, 1));
    await testDescriptorRepo.addTestDescriptor(new TestDescriptor(1,'test descriptor', 'procedure description', 1));

    await restockRepo.add(new RestockOrder(undefined, dateHandler.DayjsToDateAndTime(dayjs()), "ISSUED",
      [
        { SKUId: 1, description: "item description", price: 3, qty: 2 }
      ]
      , 1, {}, []));


    await restockRepo.updateState(1, "DELIVERED");
    await restockRepo.addSKUItems(1, [
      { SKUId: 1, rfid: rfid1 },
      { SKUId: 1, rfid: rfid2 }
    ]
    );
    await restockRepo.updateState(1, "COMPLETEDRETURN");
  });

  testReturnItems(1, []);
  testReturnItems(1, [{ SKUId: 1, rfid: rfid1 }], [{ SKUId: 1, rfid: rfid1 }]);
  testReturnItems(1, [{ SKUId: 1, rfid: rfid2 }], [{ SKUId: 1, rfid: rfid2 }, { SKUId: 1, rfid: rfid1 }]);
});

describe('add restockOrder', () => {
  const item = new Item(1, "item description", 10, 1, 1)
  let ro = new RestockOrder(1, dayjs(), "ISSUED",
    [
      { SKUId: 1, description: item.description, price: item.price, qty: 2 }
    ]
    , 1, {}, []);
  ro = ro.toString();
  beforeEach(async () => {
    await dbHandler.deleteAllTablesData();
    await positionRepo.addPOS(new Position("800234543412", "8002", "3454", "3412", 100, 100, 0, 0));
    await skuRepo.addSKU(new SKU(1, "sku description", 2, 3, "note", "800234543412", 5, 10, [1]));
    await userRepo.add(new User(1, "Riccardo", "Salvatelli", "riccardo.salvatelli", "passwordd", "supplier"));
    await itemRepo.addItem(new Item(1, "item description", 10, 1, 1));
  });

  testAddRO(1, { code: 404 });
  testAddRO(1, { code: 200, data: ro }, ro);
});

describe('add SKU items', () => {
  const ro = new RestockOrder(undefined, dateHandler.DayjsToDateAndTime(dayjs()), "ISSUED",
    [
      { SKUId: 1, description: "item description", price: 3, qty: 2 }
    ]
    , 1, {}, []);
  beforeEach(async () => {
    await dbHandler.deleteAllTablesData();
    await positionRepo.addPOS(new Position("800234543412", "8002", "3454", "3412", 100, 100, 0, 0));
    await skuRepo.addSKU(new SKU(1, "sku description", 2, 3, "note", "800234543412", 5, 10, [1]));
    await userRepo.add(new User(1, "Riccardo", "Salvatelli", "riccardo.salvatelli", "passwordd", "supplier"));
    await itemRepo.addItem(new Item(1, "item description", 10, 1, 1));
    await restockRepo.add(ro);
    await restockRepo.updateState(1, 'DELIVERED');
  });

  testAddSKUItems(1, []);
  const rfid1 = "12345678901234567890123456789016";
  const rfid2 = "12345678901234567890123456789017";
  const skus = [{ SKUId: 1, rfid: rfid1 }, { SKUId: 1, rfid: rfid2 }];
  testAddSKUItems(1, skus, skus);
});

function testAddSKUItems(id, expected, skuItems = undefined) {
  test('add SKU items', async () => {
    if (skuItems) {
      await restockRepo.addSKUItems(id, skuItems);

    }
    const res = await restockRepo.get(id);
    expect(res.data.skuItems).toEqual(expected.map(s => ({ SKUId: s.SKUId, rfid: s.rfid })));
  });
}

function testAddRO(id, expected, ro = undefined) {
  test('add restockOrder', async () => {
    if (ro)
      await restockRepo.add(ro);
    let res;
    try {
      res = await restockRepo.get(id);
    }
    catch (e) {
      res = e;
    }
    expect(res).toEqual(expected);
  });
}

// only the first skuItem won't pass the test
function testReturnItems(id, expected, skuItem = undefined) {
  test('list return items of an order', async () => {
    if (skuItem && skuItem[0]) {
      let tr = new testResult(1, 1, dateHandler.DayjsToDate(dayjs()), false);
      tr.rfid = skuItem[0].rfid;
      await testResultRepo.addTestResult(tr);
    }

    const returnItems = await restockRepo.returnItems(id);

    expect(returnItems.data).toEqual(expected);
  });
}
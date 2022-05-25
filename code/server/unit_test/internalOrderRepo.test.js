const { InternalOrder } = require('../model/internalOrder');
const SKU = require('../model/sku');
const TestDescriptor = require('../model/TestDescriptor');
const Position = require('../model/position');
const dayjs = require('dayjs');
const DateHandler = require('../persistence/dateHandler');


const DBHandler = require("../persistence/DBHandler");
const skuRepository = require('../persistence/skuRepository');
const TestDescriptorRepository = require('../persistence/testDescriptorRepository');
const posRepository = require('../persistence/positionRepository');
const userRepository = require('../persistence/userRepository');
const { User } = require('../model/user');
const InternalOrderRepository = require('../persistence/internalOrderRepository');
const skuItemRepository = require('../persistence/skuItemRepository');
const SKUItem = require('../model/skuItem');

const dateHandler = new DateHandler();
const dbHandler = new DBHandler();
const positionRepo = new posRepository();
const internalRepo = new InternalOrderRepository();
const testDescriptorRepo = new TestDescriptorRepository();
const skuRepo = new skuRepository();
const skuItemRepoo = new skuItemRepository();
const userRepo = new userRepository();


describe("add internal order", () => {
  const sku1 = new SKU(1, "sku description", 2, 3, "note", "800234543412", 5, 10, [1]);
  const sku2 = new SKU(2, "another sku description", 3, 2, "note", "800234543413", 5, 10, [1]);
  beforeEach(async () => {
    await dbHandler.deleteAllTablesData();
    await positionRepo.addPOS(new Position("800234543412", "8002", "3454", "3412", 100, 100, 0, 0));
    await positionRepo.addPOS(new Position("800234543413", "8002", "3454", "3413", 100, 100, 0, 0));
    await skuRepo.addSKU(sku1);
    await skuRepo.addSKU(sku2);
    await userRepo.add(new User(1, "Riccardo", "Salvatelli", "riccardo.salvatelli", "passwordd", "supplier"));
    await testDescriptorRepo.addTestDescriptor(new TestDescriptor('test descriptor', 'procedure description', 1));
  })

  const io = new InternalOrder(1, dayjs(), "ISSUED", [{ SKUId: 1, description: sku1.description, price: sku1.price, qty: 3 }], 1).toString();
  testAdd(io, io); // correct internal order

  const io2 = new InternalOrder(1, dayjs(), "ISSUED", [{ SKUId: 999, description: sku1.description, price: sku1.price, qty: 3 }], 1).toString();
  testAdd({ code: 503 }, io2); // non existing skuid

  const io3 = new InternalOrder(1, dayjs(), "ISSUED", [{ SKUId: 1, description: sku1.description, price: sku1.price, qty: 3 }], 999).toString();
  testAdd({ code: 503 }, io3); // non existing customerId
})

describe("update state", () => {
  const sku1 = new SKU(1, "sku description", 2, 3, "note", "800234543412", 5, 10, [1]);
  const sku2 = new SKU(2, "another sku description", 3, 2, "note", "800234543413", 5, 10, [1]);
  const io = new InternalOrder(1, dayjs(), "ISSUED", [{ SKUId: 1, description: sku1.description, price: sku1.price, qty: 3 }], 1).toString();
  const products = [{ SKUId: 1, RFID: "12345678901234567890123456789016" }, { SKUId: 1, RFID: "12345678901234567890123456789038" }];
  const ioCompletedProducts = products;
  ioCompletedProducts[0].description = sku1.description;
  ioCompletedProducts[0].price = sku1.price;
  ioCompletedProducts[1].description = sku1.description;
  ioCompletedProducts[1].price = sku1.price;

  const ioCompleted = new InternalOrder(1, dayjs(), "COMPLETED", products, 1).toString();

  beforeEach(async () => {
    await dbHandler.deleteAllTablesData();
    await positionRepo.addPOS(new Position("800234543412", "8002", "3454", "3412", 100, 100, 0, 0));
    await positionRepo.addPOS(new Position("800234543413", "8002", "3454", "3413", 100, 100, 0, 0));
    await skuRepo.addSKU(sku1);
    await skuRepo.addSKU(sku2);
    await skuItemRepoo.addSKUItem(new SKUItem("12345678901234567890123456789038", 1, 1, dateHandler.DayjsToDate(dayjs())));
    await skuItemRepoo.addSKUItem(new SKUItem("12345678901234567890123456789016", 1, 1, dateHandler.DayjsToDate(dayjs())));
    await userRepo.add(new User(1, "Riccardo", "Salvatelli", "riccardo.salvatelli", "passwordd", "supplier"));
    await testDescriptorRepo.addTestDescriptor(new TestDescriptor('test descriptor', 'procedure description', 1));
    await internalRepo.add(io);
  })


  io.state = "ACCEPTED";
  testUpdateState(1, "ACCEPTED", io);
  testUpdateState(999, "ACCEPTED", { code: 404 }); // wrong internal order id
  testUpdateState(1, "COMPLETED", ioCompleted, products);
  testUpdateState(999, "COMPLETED", ioCompleted, products); // wrong internal order id
  const ioCompleted1 = new InternalOrder(1,
    dayjs(),
    "COMPLETED",
    [{ SKUId: 999, RFID: "12345678901234567890123456789016" }, { SKUId: 1, RFID: "12345678901234567890123456789038" }]
    , 1)
    .toString();
  testUpdateState(1, "COMPLETED", { code: 503 }, ioCompleted1); // nonexisting skuid
})

function testUpdateState(id, newState, expected, products = undefined) {
  test('update state', async () => {
    if (newState === 'COMPLETED') {
      try {
        await Promise.all([
          internalRepo.addToTransactionRFIDs(id, products),
          internalRepo.removeInternalTransactions(id)
        ]);
      } catch (e) { expect(e.code).toEqual(e.code); return; }
    }

    try { await internalRepo.updateState(newState, id); } catch (e) { expect(e.code).toEqual(expected.code); return; }
    const result = await internalRepo.get(id, newState);
    expect(result).toEqual(expected);
  });
}

function testAdd(expected, io = undefined) {
  test('add internal order', async () => {
    let result;
    if (io) {
      try { await internalRepo.add(io); }
      catch (e) {
        expect(e.code).toEqual(expected.code);
        return;
      }
    }
    try {
      result = await internalRepo.get(1, "ISSUED");
    }
    catch (e) {
      result = e;
    }

    expect(result).toEqual(expected);
  })
}

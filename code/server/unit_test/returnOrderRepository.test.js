const { RestockOrder } = require('../model/restockOrder');
const SKU = require('../model/sku');
const TestDescriptor = require('../model/TestDescriptor');
const Item = require('../model/item');
const Position = require('../model/position');
const dayjs = require('dayjs');
const DateHandler = require('../persistence/dateHandler');
const retOrd = require('../model/returnOrder')

const dateHandler = new DateHandler();
const DBHandler = require("../persistence/DBHandler");
const skuRepository = require('../persistence/skuRepository');
const TestDescriptorRepository = require('../persistence/testDescriptorRepository');
const posRepository = require('../persistence/positionRepository');
const restockOrderRepository = require('../persistence/restockOrderRepository');
const userRepository = require('../persistence/userRepository');
const { User } = require('../model/user');
const itemRepository = require('../persistence/itemRepository');
const retRepository = require ('../persistence/returnOrderRepository')

const dbHandler = new DBHandler();
const testDescriptorRepo = new TestDescriptorRepository();
const restockRepo = new restockOrderRepository();
const skuRepo = new skuRepository();
const itemRepo = new itemRepository();
const positionRepo = new posRepository();
const userRepo = new userRepository();
const retRep = new retRepository();

describe('add return Order and retrieve it', () => {
  const rfid1 = "12345678901234567890123456789016";
  const rfid2 = "12345678901234567890123456789017";
  beforeEach(async () => {
    await dbHandler.deleteAllTablesData();
    await positionRepo.addPOS(new Position("800234543412", "8002", "3454", "3412", 100, 100, 0, 0));
    await skuRepo.addSKU(new SKU(1, "sku description", 2, 3, "note", "800234543412", 5, 10, [1]));
    await userRepo.add(new User(1, "Franco", "Panella", "franco.panella", "password1234", "supplier"));
    await itemRepo.addItem(new Item(1, "item description", 10, 1, 1));

    await restockRepo.add(new RestockOrder(undefined, dateHandler.DayjsToDateAndTime(dayjs()), "ISSUED",
      [
        { SKUId: 1, itemId:1, description: "item description", price: 3, qty: 2 }
      ]
      , 1, {}, []));


    await restockRepo.updateState(1, "DELIVERED");
    await restockRepo.addSKUItems(1, [
      { SKUId: 1, itemId:1, rfid: rfid1 },
      { SKUId: 1, itemId:1, rfid: rfid2 }
    ]
    );
  });
  const products = [{ SKUId: 1, itemId:1, description: "item description", price: 10, RFID : "12345678901234567890123456789016" }]
  testAddRO(1, [new retOrd(1, "2021/11/29 09:33",   [
    { SKUId: 1, itemId:1, description: "item description", price: 10, RFID : "12345678901234567890123456789016" }
  ] ,1)], "2021/11/29 09:33", products, 1);
});

function testAddRO(id, expected, returnDate, products, restockOrderID) {
  test('add return Order + add return Order transaction + get return Order', async () => {
  await retRep.addReturnOrder(returnDate, restockOrderID);
  await retRep.addReturnOrderTransaction(id, products);
  let  res = await retRep.getReturnOrderbyID(id);
  res[0].products= await retRep.getProductsbyID(id);
  expect(res).toEqual(expected);
  });
}

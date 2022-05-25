const chai = require('chai');
const chaiHttp = require('chai-http');
const dayjs = require('dayjs');

const { InternalOrder } = require('../model/internalOrder');
const SKU = require('../model/sku');
const TestDescriptor = require('../model/TestDescriptor');
const Position = require('../model/position');
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

chai.use(chaiHttp);
chai.should();
const app = require("../server");
let agent = chai.request.agent(app);

describe('POST add internal order', () => {
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
  });

  // correct { id: 1, issueDate: dateHandler.DayjsToDateAndTime(dayjs()), state: "ISSUED", products: [{ SKUId: 1, description: sku1.description, price: sku1.price, qty: 3 }], customerId: 1 }

  // wrong issueDate
  testAddInternalOrder(422, { id: 1, issueDate: "202113/12 09:33", state: "ISSUED", products: [{ SKUId: 1, description: sku1.description, price: sku1.price, qty: 3 }], customerId: 1 })
  // wrong state
  testAddInternalOrder(422, { id: 1, issueDate: dateHandler.DayjsToDateAndTime(dayjs()), state: "wrontState", products: [{ SKUId: 1, description: sku1.description, price: sku1.price, qty: 3 }], customerId: 1 });
  // empty products
  testAddInternalOrder(422, { id: 1, issueDate: dateHandler.DayjsToDateAndTime(dayjs()), state: "ISSUED", products: [{ SSKUId: 1, description: sku1.description, price: sku1.price, qty: 3 }], customerId: 1 });
  // wrong product.SKUId 
  testAddInternalOrder(503, { id: 1, issueDate: dateHandler.DayjsToDateAndTime(dayjs()), state: "ISSUED", products: [{ SKUId: 333, description: sku1.description, price: sku1.price, qty: 3 }], customerId: 1 });
  // wrong customerId
  testAddInternalOrder(503, { id: 1, issueDate: dateHandler.DayjsToDateAndTime(dayjs()), state: "ISSUED", products: [{ SKUId: 1, description: sku1.description, price: sku1.price, qty: 3 }], customerId: 999 });
  // missing customerId
  testAddInternalOrder(422, { id: 1, issueDate: dateHandler.DayjsToDateAndTime(dayjs()), state: "ISSUED", products: [{ SKUId: 1, description: sku1.description, price: sku1.price, qty: 3 }] });

  // correct
  testAddInternalOrder(200, { id: 1, issueDate: dateHandler.DayjsToDateAndTime(dayjs()), state: "ISSUED", products: [{ SKUId: 1, description: sku1.description, price: sku1.price, qty: 3 }], customerId: 1 });
});

describe('PUT update state', () => {
  const sku1 = new SKU(1, "sku description", 2, 3, "note", "800234543412", 5, 10, [1]);
  const skuItem1 = new SKUItem("12345678901234567890123456789038", 1, 1, dateHandler.DayjsToDate(dayjs()));
  const skuItem2 = new SKUItem("12345678901234567890123456789039", 1, 1, dateHandler.DayjsToDate(dayjs()));
  beforeEach(async () => {
    await dbHandler.deleteAllTablesData();
    await positionRepo.addPOS(new Position("800234543412", "8002", "3454", "3412", 100, 100, 0, 0));
    await skuRepo.addSKU(sku1);
    await skuItemRepoo.addSKUItem(skuItem1);
    await skuItemRepoo.addSKUItem(skuItem2);
    await userRepo.add(new User(1, "Riccardo", "Salvatelli", "riccardo.salvatelli", "passwordd", "supplier"));
    await testDescriptorRepo.addTestDescriptor(new TestDescriptor('test descriptor', 'procedure description', 1));
    await internalRepo.add({ id: 1, issueDate: dateHandler.DayjsToDateAndTime(dayjs()), state: "ISSUED", products: [{ SKUId: 1, description: sku1.description, price: sku1.price, qty: 3 }], customerId: 1 });
  });


  testUpdateState(503, 1, { newState: "COMPLETED", products: [{ SkuID: 1, RFID: "12345678901234567890123456789000" }, { SkuID: 1, RFID: skuItem2.RFID }] });
  testUpdateState(404, 999, { newState: "COMPLETED", products: [{ SkuID: 1, RFID: skuItem1.RFID }, { SkuID: 1, RFID: skuItem2.RFID }] });
  testUpdateState(422, 1, { newState: "COMPLETED", products: [{ SkuSkuID: 1, RFID: skuItem1.RFID }, { SkuID: 1, RFID: skuItem2.RFID }] });
  testUpdateState(422, 1);
  testUpdateState(422, {});
  testUpdateState(422, { newState: "wrongState" });
  testUpdateState(422, 1, { newState: "COMPLETED" });
  testUpdateState(200, 1, { newState: "ACCEPTED", products: [{ SkuID: 1, RFID: skuItem1.RFID }, { SkuID: 1, RFID: skuItem2.RFID }] });
  testUpdateState(200, 1, { newState: "ACCEPTED" });
  testUpdateState(200, 1, { newState: "COMPLETED", products: [{ SkuID: 1, RFID: skuItem1.RFID }, { SkuID: 1, RFID: skuItem2.RFID }] });
});

function testAddInternalOrder(expectedStatus, io) {
  it('POST add internal order', (done) => {
    agent.post('/api/internalOrders')
      .send(io)
      .then(function (res) {
        res.should.have.status(expectedStatus);
        done();
      }).catch(done);
  });
}

function testUpdateState(expectedStatus, id, obj) {
  it('PUT update state', (done) => {
    agent.put(`/api/internalOrders/${id}`)
      .send(obj)
      .then(function (res) {
        res.should.have.status(expectedStatus);
        done();
      }).catch(done);
  });
}
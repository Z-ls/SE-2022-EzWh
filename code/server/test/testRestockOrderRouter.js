const chai = require('chai');
const chaiHttp = require('chai-http');
const dayjs = require('dayjs');

const { RestockOrder } = require('../model/restockOrder');
const SKU = require('../model/sku');
const TestDescriptor = require('../model/TestDescriptor');
const Item = require('../model/item');
const Position = require('../model/position');

const DateHandler = require('../persistence/dateHandler');
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

const dateHandler = new DateHandler();
const dbHandler = new DBHandler();
const testDescriptorRepo = new TestDescriptorRepository();
const testResultRepo = new TestResultRepository();
const restockRepo = new restockOrderRepository();
const skuRepo = new skuRepository();
const itemRepo = new itemRepository();
const positionRepo = new posRepository();
const userRepo = new userRepository();

chai.use(chaiHttp);
chai.should();
const app = require("../server");
let agent = chai.request.agent(app);

describe('POST restockOrder', () => {
  const item = new Item(1, "item description", 10, 1, 1);
  const position = new Position("800234543412", "8002", "3454", "3412", 100, 100, 0, 0);
  const sku1 = new SKU(1, "sku description", 2, 3, "note", "800234543412", 5, 10, [1]);
  const user1 = new User(1, "Riccardo", "Salvatelli", "riccardo.salvatelli", "passwordd", "supplier");
  const correctRO = new RestockOrder(1, "2021/11/11 09:33", "ISSUED", [{ SKUId: 1, description: item.description, price: item.price, qty: 2 }], 1, {}, []);

  beforeEach(async () => {
    await dbHandler.deleteAllTablesData();
    await positionRepo.addPOS(position);
    await skuRepo.addSKU(sku1);
    await userRepo.add(user1);
    await itemRepo.addItem(item);
  });

  // correct { id: 1, issueDate: "2021/11/11 09:33", state: "ISSUED", products: [{ SKUId: 1, description: item.description, price: item.price, qty: 2 }], supplierId: 1, transportNote: {}, skuItems: [] })
  // wrong issueDate
  addRO(422, { id: 1, issueDate: "2021/15/11 09:33", state: "ISSUED", products: [{ SKUId: 1, description: item.description, price: item.price, qty: 2 }], supplierId: 1, transportNote: {}, skuItems: [] });

  // wrong state
  addRO(422, { id: 1, issueDate: "2021/15/11 09:33", state: "wrongState", products: [{ SKUId: 1, description: item.description, price: item.price, qty: 2 }], supplierId: 1, transportNote: {}, skuItems: [] });

  // wrong products structure
  addRO(422, { id: 1, issueDate: "2021/15/11 09:33", state: "ISSUED", products: [{ SKKUId: 1, description: item.description, price: item.price, qty: 2 }], supplierId: 1, transportNote: {}, skuItems: [] });

  // non existing supplierId
  addRO(422, { id: 1, issueDate: "2021/15/11 09:33", state: "ISSUED", products: [{ SKKUId: 1, description: item.description, price: item.price, qty: 2 }], supplierId: 999, transportNote: {}, skuItems: [] });

  addRO(201, { id: 1, issueDate: "2021/11/11 09:33", state: "ISSUED", products: [{ SKUId: 1, description: item.description, price: item.price, qty: 2 }], supplierId: 1, transportNote: {}, skuItems: [] });

});

describe('PUT skuItems', () => {
  const item = new Item(1, "item description", 10, 1, 1);
  const position1 = new Position("800234543412", "8002", "3454", "3412", 100, 100, 0, 0);
  const position2 = new Position("800234543413", "8002", "3454", "3413", 100, 100, 0, 0);
  const sku1 = new SKU(1, "sku description", 2, 3, "note", "800234543412", 5, 10, [1]);
  const sku2 = new SKU(2, "sku2 description", 6, 7, "note", "800234543412", 5, 10, [1]);
  const user1 = new User(1, "Riccardo", "Salvatelli", "riccardo.salvatelli", "passwordd", "supplier");
  const ro = new RestockOrder(1, "2021/11/11 09:33", "ISSUED", [{ SKUId: 1, description: item.description, price: item.price, qty: 2 }], 1, {}, []);


  beforeEach(async () => {
    await dbHandler.deleteAllTablesData();
    await positionRepo.addPOS(position1);
    await positionRepo.addPOS(position2);
    await skuRepo.addSKU(sku1);
    await skuRepo.addSKU(sku2);
    await userRepo.add(user1);
    await itemRepo.addItem(item);
    await restockRepo.add(ro);
    await restockRepo.updateState(1, "DELIVERED");
  });

  // correct sku {SKUId:1, rfid:"12345678901234567890123456789016"}
  // another     {SKUId:2, rfid:"12345678901234567890123456789017"}
  
  // wrong id
  testSkuItems(404, 999, { skuItems: [] });
  testSkuItems(422, 3.2, { skuItems: [{ SKUId: 1, rfid: "12345678901234567890123456789016" }] });
  testSkuItems(422, -1, { skuItems: [{ SKUId: 1, rfid: "12345678901234567890123456789016" }] });

  // wrong skuItems structure
  testSkuItems(422, 1, [{ SKUId: 1, rfid: "12345678901234567890123456789016" }]);
  testSkuItems(422, 1, { skuItems: {} });
  testSkuItems(422, 1, {});
  testSkuItems(422, 1, { skuItems: [{ SKUId: 1, rfid: "!= than 32 chars" }] });
  testSkuItems(422, 1, { skuItems: [{ SKUId: "1", rfid: "!= than 32 chars" }] });
  testSkuItems(422, 1, { skuItems: [{ SKUId: 1, rfid: "!= than 32 chars" }] })

  // non-existing SKUId
  testSkuItems(422, 1, { skuItems: [{ SKUId: 999, rfid: "12345678901234567890123456789016" }] });

  // correct
  testSkuItems(200, 1, { skuItems: [{ SKUId: 1, rfid: "12345678901234567890123456789016" }] });
});

function addRO(expectedStatus, ro) {
  it('POST restockOrder', (done) => {
    agent.post('/api/restockOrder')
      .send(ro)
      .then(function (res) {
        res.should.have.status(expectedStatus);
        done();
      }).catch(done);
  })
}

function testSkuItems(expectedStatus, id, skuItems) {
  it('PUT skuitems', (done) => {
    agent.put(`/api/restockOrder/${id}/skuItems`)
      .send(skuItems)
      .then(function (res) {
        res.should.have.status(expectedStatus);
        done();
      }).catch(done);
  });
}




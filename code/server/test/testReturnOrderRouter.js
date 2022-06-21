const chai = require('chai');
const chaiHttp = require('chai-http');
const dayjs = require('dayjs');

const { RestockOrder } = require('../model/restockOrder');
const SKU = require('../model/sku');
const TestDescriptor = require('../model/TestDescriptor');
const Item = require('../model/item');
const Position = require('../model/position');
const returnOrder = require('../model/returnOrder');

const DateHandler = require('../persistence/dateHandler');
const DBHandler = require("../persistence/DBHandler");
const skuRepository = require('../persistence/skuRepository');
const posRepository = require('../persistence/positionRepository');
const restockOrderRepository = require('../persistence/restockOrderRepository');
const userRepository = require('../persistence/userRepository');
const { User } = require('../model/user');
const itemRepository = require('../persistence/itemRepository');
const retRepository = require('../persistence/returnOrderRepository');

const dateHandler = new DateHandler();
const dbHandler = new DBHandler();
const restockRepo = new restockOrderRepository();
const skuRepo = new skuRepository();
const itemRepo = new itemRepository();
const positionRepo = new posRepository();
const userRepo = new userRepository();
const retRep = new retRepository();

chai.use(chaiHttp);
chai.should();
const app = require("../server");
let agent = chai.request.agent(app);

describe('POST returnOrder', () => {
  const item = new Item(1, "item description", 10, 1, 1);
  const position = new Position("800234543412", "8002", "3454", "3412", 100, 100, 0, 0);
  const sku1 = new SKU(1, "sku description", 2, 3, "note", "800234543412", 5, 10, [1]);
  const user1 = new User(1, "Franco", "Panella", "franco.panella", "password1234", "supplier");
  const ro = new RestockOrder(1, "2021/11/11 09:33", "ISSUED", [{ SKUId: 1, itemId:1, description: item.description, price: item.price, qty: 2 }], 1, {}, []);

  beforeEach(async () => {
    await dbHandler.deleteAllTablesData();
    await positionRepo.addPOS(position);
    await skuRepo.addSKU(sku1);
    await userRepo.add(user1);
    await itemRepo.addItem(item);
    await restockRepo.add(ro);
    await restockRepo.updateState(1, "DELIVERED");
    await restockRepo.addSKUItems(1, [
        { SKUId: 1, rfid: "12345678901234567890123456789016" }
      ]
      );
  });

  addRetOrd(201, {
    returnDate:"2021/11/29 09:33",
    products: [{SKUId:1, itemId:1, description:"item description", price:10, RFID:"12345678901234567890123456789016"}],
    restockOrderId : 1
}
);

addRetOrd(503, {
    returnDate:"2021/11/29 09:33",
    products: [{SKUId:1, itemId:1, description:"item description", price:10, RFID:"12345678901234567890123456789016"}],
    restockOrderId : 10
}
);

addRetOrd(422, {
    returnDate:undefined,
    products: [{SKUId:1, itemId:1, description:"item description", price:10, RFID:"12345678901234567890123456789016"}],
    restockOrderId : 10
}
);
});

function addRetOrd(expectedStatus, ro) {
  it('POST returnOrder', (done) => {
    agent.post('/api/returnOrder')
      .send(ro)
      .then(function (res) {
        res.should.have.status(expectedStatus);
        done();
      }).catch(done);
  })
}


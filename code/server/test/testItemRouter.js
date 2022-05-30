const chai = require('chai');
const chaiHttp = require('chai-http');
const DBHandler = require("../persistence/DBHandler");
const skuRepository = require("../persistence/skuRepository");
const userRepository = require("../persistence/userRepository");
const itemRepository = require("../persistence/itemRepository");
const itemRep = new itemRepository();
const dbHAndler = new DBHandler();
const skuRep = new skuRepository();
const userRep = new userRepository();

chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);

describe('POST Item', () => {

    beforeEach(async () => {
        await dbHAndler.deleteAllTablesData();
        await userRep.add({
            username:"user1@ezwh.com",
            name:"John",
            surname : "Smith",
            password : "testpassword",
            type : "supplier"
    
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
    })

    addItem(422, {id : 12,price : 10.99,SKUId : 1,supplierId : 2});
    addItem(422, {id : 12, description : "a new item",price : -10.99,SKUId : -1,supplierId : 2});
    addItem(404, {id : 12, description : "a new item",price : 10.99,SKUId : 15,supplierId : 2});
    addItem(201, {id : 12, description : "a new item",price : 10.99,SKUId : 1,supplierId : 1});

});

describe('GET Item', () => {

    beforeEach(async () => {
        await dbHAndler.deleteAllTablesData();
        await userRep.add({
            username:"user1@ezwh.com",
            name:"John",
            surname : "Smith",
            password : "testpassword",
            type : "supplier"
    
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
        await itemRep.addItem({
            id : 12,
            description : "a new item",
            price : 10.99,
            SKUId : 1,
            supplierId : 1
        }
        );
    })

    getItemById(422,{});
    getItemById(404,{},2);
    getItemById(200,{ id:12,description : "a new item",price : 10.99,SKUId : 1,supplierId : 1},12);
    getItems(200,[{ id:12,description : "a new item",price : 10.99,SKUId : 1,supplierId : 1}]);
});

describe('PUT Item', () => {

    beforeEach(async () => {
        await dbHAndler.deleteAllTablesData();
        await userRep.add({
            username:"user1@ezwh.com",
            name:"John",
            surname : "Smith",
            password : "testpassword",
            type : "supplier"
    
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
        await itemRep.addItem({
            id : 12,
            description : "a new item",
            price : 10.99,
            SKUId : 1,
            supplierId : 1
        }
        );
    })

    editItem(422,12,{ newPrice : 10.99});
    editItem(422,{ newDescription : "a new sku", newPrice : 10.99});
    editItem(404,13,{ newDescription : "a new sku", newPrice : 10.99});
    editItem(200,12,{ newDescription : "a new sku", newPrice : 10.99});
});

describe('DELETE Item', () => {

    beforeEach(async () => {
        await dbHAndler.deleteAllTablesData();
        await userRep.add({
            username:"user1@ezwh.com",
            name:"John",
            surname : "Smith",
            password : "testpassword",
            type : "supplier"
    
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
        await itemRep.addItem({
            id : 12,
            description : "a new item",
            price : 10.99,
            SKUId : 1,
            supplierId : 1
        }
        );
    })

    deleteSKU(422);
    deleteSKU(422, 13);
    deleteSKU(204, 12);
});

function addItem(expectedHTTPStatus, newItem) {
    it('POST Item', function (done) {
        agent.post('/api/item')
            .send(newItem)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            }).catch(done);
    });
}

function getItemById(expectedHTTPStatus, expectedBody, id) {
    it('GET Item By ID', function (done) {
        agent.get('/api/items/'+ id)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                res.body.should.eql(expectedBody);
                done();
            }).catch(done);
    });
}

function getItems(expectedHTTPStatus, expectedBody) {
    it('GET Items', function (done) {
        agent.get('/api/items')
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                res.body.should.eql(expectedBody);
                done();
            }).catch(done);
    });
}

function editItem(expectedHTTPStatus, id, newItem) {
    it('PUT edit Item', function (done) {
        agent.put('/api/item/'+ id)
            .send(newItem)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            }).catch(done);
    });
}

function deleteSKU(expectedHTTPStatus, id) {
    it('DELETE Item', function (done) {
        agent.delete('/api/items/' + id)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            }).catch(done);
    });
}
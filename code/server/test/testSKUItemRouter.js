const chai = require('chai');
const chaiHttp = require('chai-http');
const DBHandler = require("../persistence/DBHandler");
const skuRepository = require("../persistence/skuRepository");
const skuItemRepository = require("../persistence/skuItemRepository");
const dbHAndler = new DBHandler();
const skuRep = new skuRepository();
const skuItemRep = new skuItemRepository();

chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);

describe('POST SKUItem', () => {

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
    })

    addSKUItem(422, {RFID:"123456789012345679015", SKUId:1,DateOfStock:"12/11/2021 12:30"});
    addSKUItem(404, {RFID:"12345678901234567890123456789015", SKUId:2,DateOfStock:"2021/11/29 12:30"});
    addSKUItem(201, {RFID:"12345678901234567890123456789015", SKUId:1,DateOfStock:"2021/11/29 12:30"});

});

describe('GET SKUItem', () => {

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
        await skuItemRep.addSKUItem({
            RFID:"12345678901234567890123456789015",
            SKUId:1,
            DateOfStock:"2021/11/29 12:30"
                }
            );
        await skuItemRep.addSKUItem({
            RFID:"42345678901234567890123456789016",
            SKUId:1,
            DateOfStock:"2021/12/29 13:30"
                }
            );
        await skuItemRep.editSKUItem({newRFID:"12345678901234567890123456789015",newAvailable:1, newDateOfStock:"2021/11/29 12:30"
        },"12345678901234567890123456789015");
    })

    getSKUItemByRFID(422,{},"1234567890123456789015");
    getSKUItemByRFID(404,{},"22345678901234567890123456789015");
    getSKUItemByRFID(200,{RFID:"12345678901234567890123456789015",SKUId:1,Available:1,DateOfStock:"2021/11/29 12:30"},"12345678901234567890123456789015");
    getSKUItemBySKUId(422,{},-5);
    getSKUItemBySKUId(404,{},2);
    getSKUItemBySKUId(200,[{RFID:"12345678901234567890123456789015",SKUId:1,Available:1,DateOfStock:"2021/11/29 12:30"}],1);
    getSKUItems(200,[{RFID:"12345678901234567890123456789015",SKUId:1,Available:1,DateOfStock:"2021/11/29 12:30"},{RFID:"42345678901234567890123456789016",SKUId:1,Available:0,DateOfStock:"2021/12/29 13:30"}]);
});

describe('PUT SKUItem', () => {

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
        await skuItemRep.addSKUItem({
            RFID:"12345678901234567890123456789015",
            SKUId:1,
            DateOfStock:"2021/11/29 12:30"
                }
            );
    })

    editSKUItem(422,"12345678901234567890123456789015",{newAvailable:1, newDateOfStock:"2022/11/29 12:30"});
    editSKUItem(422,"12389015",{newRFID:"12345678901290123456789015",newAvailable:-1, newDateOfStock:"1/05/2022 12:30"});
    editSKUItem(404,"12345678901234567890123456789026",{newRFID:"12345678901234567890123456789015",newAvailable:1, newDateOfStock:"2022/11/29 12:30"});
    editSKUItem(200,"12345678901234567890123456789015",{newRFID:"12345678901234567890123456789015",newAvailable:1, newDateOfStock:"2022/11/29 12:30"});
});

describe('DELETE SKUItem', () => {

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
        await skuItemRep.addSKUItem({
            RFID:"12345678901234567890123456789015",
            SKUId:1,
            DateOfStock:"2021/11/29 12:30"
                }
            );
    })

    deleteSKUItem(422, "12345678456789015");
    deleteSKUItem(422, "12345678901234567890123456789016");
    deleteSKUItem(204, "12345678901234567890123456789015");
});

function addSKUItem(expectedHTTPStatus, newSKUItem) {
    it('POST SKUItem', function (done) {
        agent.post('/api/skuitem')
            .send(newSKUItem)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            }).catch(done);
    });
}

function getSKUItemByRFID(expectedHTTPStatus, expectedBody, rfid) {
    it('GET SKUItem By RFID', function (done) {
        agent.get('/api/skuitems/'+ rfid)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                res.body.should.eql(expectedBody);
                done();
            }).catch(done);
    });
}

function getSKUItemBySKUId(expectedHTTPStatus, expectedBody, id) {
    it('GET SKUItem By SKUID', function (done) {
        agent.get('/api/skuitems/sku/'+ id)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                res.body.should.eql(expectedBody);
                done();
            }).catch(done);
    });
}

function getSKUItems(expectedHTTPStatus, expectedBody) {
    it('GET SKUItems', function (done) {
        agent.get('/api/skuitems')
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                res.body.should.eql(expectedBody);
                done();
            }).catch(done);
    });
}

function editSKUItem(expectedHTTPStatus, rfid, newSKUItem) {
    it('PUT edit SKUItem', function (done) {
        agent.put('/api/skuitems/'+ rfid)
            .send(newSKUItem)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            }).catch(done);
    });
}

function deleteSKUItem(expectedHTTPStatus, rfid) {
    it('DELETE SKUItem', function (done) {
        agent.delete('/api/skuitems/' + rfid)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            }).catch(done);
    });
}

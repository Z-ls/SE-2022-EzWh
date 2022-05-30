const chai = require('chai');
const chaiHttp = require('chai-http');
const DBHandler = require("../persistence/DBHandler");
const skuRepository = require("../persistence/skuRepository");
const posRepository = require("../persistence/positionRepository");
const posRep = new posRepository();
const skuRep = new skuRepository();
const dbHAndler = new DBHandler();

chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);

describe('POST SKU', () => {

    beforeEach(async () => {
        await dbHAndler.deleteAllTablesData();
    })

    addSKU(201, {description : "a new sku", weight : 100,volume : 50,notes : "first SKU", price : 10.99,availableQuantity : 50 });
    addSKU(422, {description : "a new sku", weight : 100,notes : "first SKU", price : 10.99,availableQuantity : 50 });
    addSKU(422, {description : "a new sku", weight : -100,volume : -50,notes : "first SKU", price : -10.99,availableQuantity : -50 });

});

describe('GET SKU', () => {

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
        await skuRep.addSKU({
            description : "a new sku",
            weight : 100,
            volume : 50,
            notes : "second SKU",
            price : 11.99,
            availableQuantity : 50
                }
            );
    })

    getSingleSKU(200, {id: 1, description : "a new sku", weight : 100,volume : 50,notes : "first SKU", position: null, availableQuantity : 50, price : 10.99, testDescriptors : [] },1);
    getSingleSKU(404, "no SKU associated to id 3",3);
    getSKUs(200, [{id: 1, description : "a new sku", weight : 100,volume : 50,notes : "first SKU", position: null, availableQuantity : 50, price : 10.99, testDescriptors : [] },
    {id: 2, description : "a new sku", weight : 100,volume : 50,notes : "second SKU", position: null, availableQuantity : 50, price : 11.99, testDescriptors : [] }]);
});

describe('PUT SKU', () => {

    beforeEach(async () => {
        await dbHAndler.deleteAllTablesData();
        await posRep.addPOS({
            positionID:"800234543412",
            aisleID: "8002",
            row: "3454",
            col: "3412",
            maxWeight: 10000,
            maxVolume: 10000
        }
        );
        await posRep.addPOS({
            positionID:"900234543413",
            aisleID: "9002",
            row: "3454",
            col: "3413",
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
            description : "a new sku",
            weight : 100,
            volume : 50,
            notes : "second SKU",
            price : 11.99,
            availableQuantity : 50
                }
            );
        await skuRep.editSKUPosition("800234543412", 1);
    })

    editSKU(422,1,{newDescription : "a new sku",newVolume : 50,newNotes : "first SKU",newPrice : 10.99,newAvailableQuantity : 50});
    editSKU(422,-1,{ newDescription : "a new sku",newWeight : -100,newVolume : -50,newNotes : "first SKU",newPrice : -10.99,newAvailableQuantity : -50});
    editSKU(422,1,{ newDescription : "a new sku",newWeight : 1000,newVolume : 5000,newNotes : "first SKU",newPrice : 10.99,newAvailableQuantity : 50});
    editSKU(404,1000,{ newDescription : "a new sku",newWeight : 100,newVolume : 50,newNotes : "first SKU",newPrice : 10.99,newAvailableQuantity : 50});
    editSKU(200,1,{ newDescription : "a new sku",newWeight : 100,newVolume : 50,newNotes : "first SKU",newPrice : 11.99,newAvailableQuantity : 50});

    editSKUPosition(422,-2,{});
    editSKUPosition(422,2,{position : "800234543412"});
    editSKUPosition(404,100,{position : "900234543413"});
    editSKUPosition(404,2,{position : "900234543412"});
    editSKUPosition(200,2,{position : "900234543413"});
});

describe('DELETE SKU', () => {

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

    deleteSKU(422, -1);
    deleteSKU(422, 2);
    deleteSKU(204, 1);
});

function addSKU(expectedHTTPStatus, newSKU) {
    it('POST SKU', function (done) {
        agent.post('/api/sku')
            .send(newSKU)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            }).catch(done);
    });
}

function getSingleSKU(expectedHTTPStatus, expectedBody, id) {
    it('GET single SKU', function (done) {
        agent.get('/api/skus/'+ id)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                res.body.should.eql(expectedBody);
                done();
            }).catch(done);
    });
}

function getSKUs(expectedHTTPStatus, expectedBody) {
    it('GET SKUs', function (done) {
        agent.get('/api/skus/')
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                res.body.should.eql(expectedBody);
                done();
            }).catch(done);
    });
}

function editSKU(expectedHTTPStatus, id, newSKU) {
    it('PUT edit SKU', function (done) {
        agent.put('/api/sku/'+ id)
            .send(newSKU)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            }).catch(done);
    });
}

function editSKUPosition(expectedHTTPStatus, id, position) {
    it('PUT edit SKU Position', function (done) {
        agent.put('/api/sku/'+ id+"/position")
            .send(position)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            }).catch(done);
    });
}

function deleteSKU(expectedHTTPStatus, id) {
    it('DELETE SKU', function (done) {
        agent.delete('/api/skus/' + id)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            }).catch(done);
    });
}

const chai = require('chai');
const chaiHttp = require('chai-http');
const DBHandler = require("../persistence/DBHandler");
const posRepository = require("../persistence/positionRepository");
const posRep = new posRepository();
const dbHAndler = new DBHandler();

chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);

describe('POST Position', () => {

    beforeEach(async () => {
        await dbHAndler.deleteAllTablesData();
    })

    addPosition(201, {positionID : "101020203030", aisleID : "1010",row : "2020",col : "3030", maxWeight : 1000, maxVolume : 100});
    addPosition(422, {positionID : "101020003000", aisleID : "1010",row : "2020",col : "3030", maxWeight : 1000, maxVolume : 100});
    addPosition(422, {positionID : "101020203030", aisleID : "1010",row : "2020",col : "3030", maxWeight : -1000, maxVolume : 100});

});

describe('GET Positions', () => {

    beforeEach(async () => {
        await dbHAndler.deleteAllTablesData();
        await posRep.addPOS({positionID : "101020203030", 
        aisleID : "1010",
        row : "2020",
        col : "3030", 
        maxWeight : 1000, 
        maxVolume : 100}
            );
        await posRep.addPOS({positionID : "111122223333", 
        aisleID : "1111",
        row : "2222",
        col : "3333", 
        maxWeight : 1000, 
        maxVolume : 100}
                );
    })

    getPositions(200, [{positionID : "101020203030", 
    aisleID : "1010",
    row : "2020",
    col : "3030", 
    maxWeight : 1000, 
    maxVolume : 100,
    occupiedWeight : 0,
    occupiedVolume : 0
},
    {positionID : "111122223333", 
        aisleID : "1111",
        row : "2222",
        col : "3333", 
        maxWeight : 1000, 
        maxVolume : 100,
        occupiedWeight : 0,
        occupiedVolume : 0}]);
});

describe('PUT Position', () => {

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
    })

    editPosition(422,"800234543412",{ newAisleID : "800",newRow : "3454",newCol : "3412",newMaxWeight : 1000,newMaxVolume : 100,newOccupiedWeight : 50, newOccupiedVolume : 50});
    editPosition(422,"800234543412",{ newAisleID : "8002",newRow : "3454",newCol : "3412",newMaxWeight : -1000,newMaxVolume : 100,newOccupiedWeight : 50, newOccupiedVolume : 50});
    editPosition(404,"800234543410",{ newAisleID : "8002",newRow : "3454",newCol : "3412",newMaxWeight : 1000,newMaxVolume : 100,newOccupiedWeight : 50, newOccupiedVolume : 50});
    editPosition(200,"800234543412",{ newAisleID : "8002",newRow : "3454",newCol : "3412",newMaxWeight : 1000,newMaxVolume : 100,newOccupiedWeight : 50, newOccupiedVolume : 50});

    /*editPositionByID(422,"800234543412",{});
    editPositionByID(404,"800234543412",{position : "900234543413"});
    editPositionByID(200,"800234543412",{position : "900234543413"});*/
});

describe('DELETE Position', () => {

    beforeEach(async () => {
        await dbHAndler.deleteAllTablesData();
        await posRep.addPOS({positionID : "101020203030", 
        aisleID : "1010",
        row : "2020",
        col : "3030", 
        maxWeight : 1000, 
        maxVolume : 100}
            );
    })

    deletePosition(422, "100010001000");
    deletePosition(422, "200010002000");
    deletePosition(204, "101020203030");
});

function addPosition(expectedHTTPStatus, newPOSITION) {
    it('POST POSITION', function (done) {
        agent.post('/api/position')
            .send(newPOSITION)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            }).catch(done);
    });
}

function getPositions(expectedHTTPStatus, expectedBody) {
    it('GET Positions', function (done) {
        agent.get('/api/positions/')
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                res.body.should.eql(expectedBody);
                done();
            }).catch(done);
    });
}

function editPosition(expectedHTTPStatus, id, newPosition) {
    it('PUT edit Position', function (done) {
        agent.put('/api/position/'+ id)
            .send(newPosition)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            }).catch(done);
    });
}

function editPositionByID(expectedHTTPStatus, id, newPosition) {
    it('PUT edit Position by ID', function (done) {
        agent.put('/api/sku/'+ id+"/changeID")
            .send(newPosition)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            }).catch(done);
    });
}

function deletePosition(expectedHTTPStatus, id) {
    it('DELETE Position', function (done) {
        agent.delete('/api/position/' + id)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            }).catch(done);
    });
}

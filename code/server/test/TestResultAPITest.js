const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
const agent = chai.request.agent(app);

const tdDao = require('../persistence/testDescriptorRepository');
const trDao = require('../persistence/testResultRepository');
const dbDAO = require('../persistence/DBHandler');
const db = new trDao();
const dbTd = new tdDao();
const dbHandler = new dbDAO();

const td = (n) => ({
    "name": `Test Descriptor ${n}`, "idSKU": n, "procedureDescription": "This test is described by ..."
});

const tr = (n) => ({
    "rfid": "12345678901234567890123456789016", "idTestDescriptor": n, "Date": "2021/11/28", "Result": true
})

const nTr = (n) => ({
    "newIdTestDescriptor": n, "newDate": "2020/11/28", "newResult": false
})

const init_test = () => {
    before(async () => {
        await dbTd.newTestDescriptorTable();
        await db.newTestResultTable();
        await dbHandler.deleteAllTablesData();
        await dbTd.repopulateDataBase();
    });

    beforeEach(async () => {
        await dbTd.newTestDescriptorTable();
        await db.newTestResultTable();
        await dbHandler.deleteAllTablesData();
        await dbTd.repopulateDataBase();
        await dbTd.addTestDescriptor(td(1));
        await dbTd.addTestDescriptor(td(2));
        await dbTd.addTestDescriptor(td(3));
        await db.addTestResult(tr(1));
        await db.addTestResult(tr(2));
    });

    after(async () => {
        await db.newTestResultTable();
        await dbTd.newTestDescriptorTable();
        await dbHandler.deleteAllTablesData();
        await dbTd.repopulateDataBase();
    });
}

describe('Test Result API Test', () => {

    describe("TEST GET /api/skuitems/:rfid/testResults", () => {

        init_test();

        it("get test results", done => {
            agent.get('/api/skuitems/12345678901234567890123456789016/testResults')
                .then(res => {
                    res.should.have.status(200);
                    res.body.should.have.length(2);
                    done();
                })
        });

        it("get test results with illegal rfid", done => {
            agent.get('/api/skuitems/notRfid/testResults')
                .then(res => {
                    res.should.have.status(422);
                    done();
                })
        });

        it("get test results with non-existent rfid", done => {
            agent.get('/api/skuitems/12345678901234567890123456789099/testResults')
                .then(res => {
                    res.should.have.status(404);
                    done();
                })
        });

        it("get test results after table dropped", done => {
            db.dropTable();
            agent.get('/api/skuitems/12345678901234567890123456789016/testResults')
                .then(res => {
                    res.should.have.status(500);
                    done();
                })
        });
    });

    describe("TEST GET /api/skuitems/:rfid/testResult/:id", () => {

        init_test();

        it("get test result by rfid and id", done => {
            agent.get('/api/skuitems/12345678901234567890123456789016/testResults/1')
                .then(res => {
                    res.should.have.status(200);
                    res.body.should.have.property("id").equal(1);
                    res.body.should.have.property("idTestDescriptor").equal(1);
                    res.body.should.have.property("Date").equal("2021/11/28");
                    res.body.should.have.property("Result").equal(true);
                    done();
                }).catch(done);
        });

        it("get test result by rfid non-existent", done => {
            agent.get('/api/skuitems/12345678901234567890123456789099/testResults/1')
                .then(res => {
                    res.should.have.status(404);
                    done();
                })
        });

        it("get test result by illegal rfid", done => {
            agent.get('/api/skuitems/illegalRFID/testResults/1')
                .then(res => {
                    res.should.have.status(422);
                    done();
                })
        });

        it("get test result by non-existent id", done => {
            agent.get('/api/skuitems/12345678901234567890123456789016/testResults/99')
                .then(res => {
                    res.should.have.status(404);
                    done();
                })
        });

        it("get test result by illegal id", done => {
            agent.get('/api/skuitems/12345678901234567890123456789016/testResults/NotId')
                .then(res => {
                    res.should.have.status(422);
                    done();
                })
        });

        it("get test result after table dropped", done => {
            db.dropTable();
            agent.get('/api/skuitems/12345678901234567890123456789016/testResults/1')
                .then(res => {
                    res.should.have.status(500);
                    done();
                })
        });

    });

    describe("TEST POST /api/skuitems/testResult", () => {

        init_test();

        it("post new test result", done => {
            agent.post('/api/skuitems/testResult/')
                .send(tr(3))
                .then(res => {
                    res.should.have.status(201);
                    done();
                }).catch(done);
        });

        it("post new test result with rfid non-existent", done => {
            agent.post('/api/skuitems/testResult/')
                .send({
                    "rfid": "12345678901234567890123456789099",
                    "idTestDescriptor": 3,
                    "Date": "2021/11/28",
                    "Result": true
                })
                .then(res => {
                    res.should.have.status(404);
                    done();
                })
        });

        it("post new test result with illegal rfid", done => {
            agent.post('/api/skuitems/testResult/')
                .send({
                    "rfid": "NotRFID", "idTestDescriptor": 3, "Date": "2021/11/28", "Result": true
                })
                .then(res => {
                    res.should.have.status(422);
                    done();
                })
        });

        it("post new test result with idTestDescriptor non-existent", done => {
            agent.post('/api/skuitems/testResult/')
                .send({
                    "rfid": "12345678901234567890123456789016",
                    "idTestDescriptor": 99,
                    "Date": "2021/11/28",
                    "Result": true
                })
                .then(res => {
                    res.should.have.status(404);
                    done();
                })
        });

        it("post new test result with illegal idTestDescriptor", done => {
            agent.post('/api/skuitems/testResult/')
                .send({
                    "rfid": "12345678901234567890123456789016",
                    "idTestDescriptor": "Not Integer",
                    "Date": "2021/11/28",
                    "Result": true
                })
                .then(res => {
                    res.should.have.status(422);
                    done();
                })
        });

        it("post new test result with illegal date", done => {
            agent.post('/api/skuitems/testResult/')
                .send({
                    "rfid": "12345678901234567890123456789016",
                    "idTestDescriptor": 3,
                    "Date": "Not A Date",
                    "Result": true
                })
                .then(res => {
                    res.should.have.status(422);
                    done();
                })
        });

        it("post new test result by illegal result", done => {
            agent.post('/api/skuitems/testResult/')
                .send({
                    "rfid": "12345678901234567890123456789016",
                    "idTestDescriptor": 3,
                    "Date": "2021/11/28",
                    "Result": "Not A Boolean"
                })
                .then(res => {
                    res.should.have.status(422);
                    done();
                })
        });
    });

    describe("TEST PUT /api/skuitems/:rfid/testResult/:id", () => {

        init_test();

        it("update test result", done => {
            agent.put('/api/skuitems/12345678901234567890123456789016/testResult/1')
                .send(nTr(2))
                .then(res => {
                    res.should.have.status(200);
                    done();
                })
        });

        it("update test result with rfid non-existent", done => {
            agent.put('/api/skuitems/12345678901234567890123456789099/testResult/1')
                .send(nTr(2))
                .then(res => {
                    res.should.have.status(404);
                    done();
                })
        });

        it("update test result with illegal rfid", done => {
            agent.put('/api/skuitems/NotRFID/testResult/1')
                .send(nTr(2))
                .then(res => {
                    res.should.have.status(422);
                    done();
                })
        });

        it("update test result with id non-existent", done => {
            agent.put('/api/skuitems/12345678901234567890123456789016/testResult/99')
                .send(nTr(2))
                .then(res => {
                    res.should.have.status(404);
                    done();
                })
        });

        it("update test result with illegal id", done => {
            agent.put('/api/skuitems/12345678901234567890123456789016/testResult/NotInteger')
                .send(nTr(2))
                .then(res => {
                    res.should.have.status(422);
                    done();
                })
        });

        it("update test result with idTestDescriptor non-existent", done => {
            agent.put('/api/skuitems/12345678901234567890123456789016/testResult/1')
                .send({
                    "newIdTestDescriptor": 99, "newDate": "2020/11/28", "newResult": false
                })
                .then(res => {
                    res.should.have.status(404);
                    done();
                })
        });

        it("update test result with illegal idTestDescriptor", done => {
            agent.put('/api/skuitems/12345678901234567890123456789016/testResult/1')
                .send({
                    "newIdTestDescriptor": "Not a Integer", "newDate": "2020/11/28", "newResult": false
                })
                .then(res => {
                    res.should.have.status(422);
                    done();
                })
        });

        it("update test result with illegal date", done => {
            agent.put('/api/skuitems/12345678901234567890123456789016/testResult/1')
                .send({
                    "newIdTestDescriptor": 1, "newDate": "Not a Date", "newResult": false
                })
                .then(res => {
                    res.should.have.status(422);
                    done();
                })
        });

        it("update test result by illegal result", done => {
            agent.put('/api/skuitems/12345678901234567890123456789016/testResult/1')
                .send({
                    "newIdTestDescriptor": 1, "newDate": "2020/11/28", "newResult": "Not a Boolean"
                })
                .then(res => {
                    res.should.have.status(422);
                    done();
                })
        });

        it("update test result after table dropped", done => {
            db.dropTable();
            agent.put('/api/skuitems/12345678901234567890123456789016/testResult/1')
                .send(nTr(2))
                .then(res => {
                    res.should.have.status(503);
                    done();
                })
        });
    });

    describe("TEST DELETE /api/skuitems/:rfid/testResult/:id", () => {

        init_test();

        it("delete test result by rfid and id", done => {
            agent.delete('/api/skuitems/12345678901234567890123456789016/testResult/1')
                .then(res => {
                    res.should.have.status(204);
                    done();
                })
        });

        it("delete test result by rfid non-existent", done => {
            agent.delete('/api/skuitems/12345678901234567890123456789099/testResult/1')
                .then(res => {
                    res.should.have.status(404);
                    done();
                })
        });

        it("delete test result by illegal rfid", done => {
            agent.delete('/api/skuitems/illegalRFID/testResult/1')
                .then(res => {
                    res.should.have.status(422);
                    done();
                })
        });

        it("delete test result by non-existent id", done => {
            agent.delete('/api/skuitems/12345678901234567890123456789016/testResult/99')
                .then(res => {
                    res.should.have.status(404);
                    done();
                })
        });

        it("delete test result by illegal id", done => {
            agent.delete('/api/skuitems/12345678901234567890123456789016/testResult/NotId')
                .then(res => {
                    res.should.have.status(422);
                    done();
                })
        });

        it("delete test result after table dropped", done => {
            db.dropTable();
            agent.delete('/api/skuitems/12345678901234567890123456789016/testResult/1')
                .then(res => {
                    res.should.have.status(503);
                    done();
                });
        });
    });
});


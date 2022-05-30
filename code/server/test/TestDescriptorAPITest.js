const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
const agent = chai.request.agent(app);

const tdDao = require('../persistence/testDescriptorRepository');
const dbDAO = require('../persistence/DBHandler');
const db = new tdDao();
const dbHandler = new dbDAO();

const td = (n) => ({
    "name": `Test Descriptor ${n}`, "idSKU": n, "procedureDescription": "This test is described by ..."
});

const nTd = (n) => ({
    "newName": `New Test Descriptor ${n}`, "newIdSKU": n, "newProcedureDescription": "New This test is described by ..."
});

const init_test = () => {

    before(async () => {
        await dbHandler.deleteAllTablesData();
        await db.repopulateDataBase();
    });

    beforeEach(async () => {
        await db.deleteTestDescriptordata();
        await db.addTestDescriptor(td(1));
        await db.addTestDescriptor(td(2));
    });

    after(async () => {
        await dbHandler.deleteAllTablesData();
        await db.repopulateDataBase();
    });
}

describe('Test Descriptor API Test', () => {


    describe("TEST GET /api/testDescriptors", () => {

        init_test();

        it("get descriptors", done => {
            agent.get('/api/testDescriptors')
                .then(res => {
                    res.should.have.status(200);
                    res.body.should.have.length(2);
                    done();
                }).catch(done)
        });


    });

    describe("TEST GET /api/testDescriptor/:id", () => {

        init_test();

        it("get descriptor", done => {
            agent.get('/api/testDescriptors/1')
                .then(res => {
                    res.should.have.status(200);
                    res.body.should.have.property("id").equal(1);
                    res.body.should.have.property("idSKU").equal(1);
                    res.body.should.have.property("name").equal("Test Descriptor 1");
                    res.body.should.have.property("procedureDescription").equal("This test is described by ...");
                    done();
                })
        });

        it("get descriptor id non-existent", done => {
            agent.get('/api/testDescriptors/99')
                .then(res => {
                    res.should.have.status(404);
                    done();
                })
        });


    });

    describe("TEST POST /api/testDescriptor", () => {

        init_test();

        it("add a descriptor", done => {
            agent.post('/api/testDescriptor')
                .send(td(1))
                .then(res => {
                    res.should.have.status(201);
                    done();
                }).catch(done);
        });

        it("add an undefined descriptor", done => {
            agent.post('/api/testDescriptor')
                .send(undefined)
                .then(res => {
                    res.should.have.status(422);
                    done();
                });
        });

        it("add a descriptor with non-existent SKUId", done => {
            agent.post('/api/testDescriptor')
                .send(td(99))
                .then(res => {
                    res.should.have.status(404);
                    done();
                });
        });
    });

    describe("TEST PUT /api/testDescriptor/:id", () => {

        init_test();

        it("update a descriptor", done => {
            agent.put('/api/testDescriptor/1')
                .send(nTd(2))
                .then(res => {
                    res.should.have.status(200);
                    done();
                }).catch(done);
        });

        it("update an undefined descriptor", done => {
            agent.put('/api/testDescriptor/1')
                .send(nTd(undefined))
                .then(res => {
                    res.should.have.status(422);
                    done();
                });
        });

        it("update a descriptor with non-existent SKUId", done => {
            agent.put('/api/testDescriptor/1')
                .send(nTd(99))
                .then(res => {
                    res.should.have.status(404);
                    done();
                });
        });


    });

    describe("TEST DELETE /api/testDescriptor/:id", () => {

        init_test();

        it("delete a descriptor", done => {
            agent.delete('/api/testDescriptor/1')
                .then(res => {
                    res.should.have.status(204);
                    done();
                });

        });

        it("delete an invalid descriptor", done => {
            agent.delete('/api/testDescriptor/abc')
                .then(res => {
                    res.should.have.status(422);
                    done();
                });
        });

        it("delete an non-existent descriptor", done => {
            agent.delete('/api/testDescriptor/99')
                .then(res => {
                    res.should.have.status(404);
                    done();
                });
        });


    });
});

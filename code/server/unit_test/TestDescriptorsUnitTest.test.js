const tdDao = require('../persistence/testDescriptorRepository');
const dbDAO = require('../persistence/DBHandler')
const tdController = require('../controllers/testDescriptorController')
const db = new tdDao();
const dbHandler = new dbDAO();

const mockReq = (id, td) => { return ({
    params: { id: id },
    body: td
});}

const mockRes = {
    status: (n) => { return ({
        json: () => { return n; },
        end: () => { return n; },
        send: (c) => { return c; },
        sendStatus: () => { return n; }
    })}
}

const init_test = () => {
    beforeAll(async () => {
        await db.newTestDescriptorTable();
        await dbHandler.deleteAllTablesData();
    });

    beforeEach(async () => {
        await db.newTestDescriptorTable();
        await dbHandler.deleteAllTablesData();
        await db.repopulateDataBase();
        await db.addTestDescriptor({
            name: "Test Descriptor 1", idSKU: 1, procedureDescription: "This test is described by ..."
        });
        await tdController.addTestDescriptor(mockReq(undefined,{
            name: "Test Descriptor 2", idSKU: 2, procedureDescription: "This test is described by ..."
        }), mockRes);
    });

    afterAll(async () => {
        await db.newTestDescriptorTable();
        await dbHandler.deleteAllTablesData();
        await db.repopulateDataBase();
    });
}

describe('Test Descriptor Unit Test', () => {

    describe("updateTestDescriptor Black Box", () => {

        init_test();

        test("reqWithCorrectData", async () => {
            await db.updateTestDescriptor({
                newName: "New Test Descriptor 1", newIdSKU: 1, newProcedureDescription: "New This test is described by ..."
            }, 1);
            expect(await tdController.updateTestDescriptor(mockReq(1, {
                newName: "New Test Descriptor 1", newIdSKU: 1, newProcedureDescription: "New This test is described by ..."
            }, 1), mockRes)).toBe(200);
            expect(await db.getTestDescriptorById(1)).toEqual({
                id: 1,
                "name": "New Test Descriptor 1",
                "idSKU": 1,
                "procedureDescription": "New This test is described by ..."
            });
            expect(await tdController.getTestDescriptorById(
                {params: {id: 1}},
                { status: (n) => { return ({ json: ()=> { return n }})}}))
                .toEqual(200);
        });

        test("reqWithNonIntegerId", async () => {
            expect(await db.updateTestDescriptor({
                newName: "New Test Descriptor 1",
                newIdSKU: 1,
                newProcedureDescription: "New This test is described by ..."
            }, "Not Integer").catch(err => err.toString())).toBe("404");
            expect(await tdController.updateTestDescriptor(mockReq("Non Integer", {
                newName: "New Test Descriptor 1",
                newIdSKU: 1,
                newProcedureDescription: "New This test is described by ..."
            }, 1), mockRes)).toBe("no id associated test descriptor");
        });

        test("reqWithZeroId", async () => {
            expect(await db.updateTestDescriptor({
                newName: "New Test Descriptor 1", newIdSKU: 1, newProcedureDescription: "New This test is described by ..."
            }, 0).catch(err => err.toString())).toBe("404");
            expect(await tdController.updateTestDescriptor(mockReq(0, {
                newName: "New Test Descriptor 1",
                newIdSKU: 1,
                newProcedureDescription: "New This test is described by ..."
            }, 1), mockRes)).toBe("no id associated test descriptor");
        });

        test("reqWithNonIntegerNewIdSKU", async () => {
            expect(await db.updateTestDescriptor({
                newName: "New Test Descriptor 1",
                newIdSKU: "Not Integer",
                newProcedureDescription: "New This test is described by ..."
            }, 1).catch(err => err.toString())).toStrictEqual("Error: SQLITE_CONSTRAINT: FOREIGN KEY constraint failed");
            expect(await tdController.updateTestDescriptor(mockReq(1, {
                newName: "New Test Descriptor 1",
                newIdSKU: "Not Integer",
                newProcedureDescription: "New This test is described by ..."
            }, 1), mockRes)).toBe("no sku associated idSKU");
        });


        test("reqWithZeroNewIdSKU", async () => {
            expect(await db.updateTestDescriptor({
                newName: "New Test Descriptor 1", newIdSKU: 0, newProcedureDescription: "New This test is described by ..."
            }, 1).catch(err => err.toString())).toStrictEqual("Error: SQLITE_CONSTRAINT: FOREIGN KEY constraint failed");
            expect(await tdController.updateTestDescriptor(mockReq(1, {
                newName: "New Test Descriptor 1",
                newIdSKU: 0,
                newProcedureDescription: "New This test is described by ..."
            }, 1), mockRes)).toBe("no sku associated idSKU");
        });

        test("reqWithEmptyNewName", async () => {
            expect(await db.updateTestDescriptor({
                newName: undefined, newIdSKU: 1, newProcedureDescription: "New This test is described by ..."
            }, 1).catch(err => err.toString())).toStrictEqual("Error: SQLITE_CONSTRAINT: NOT NULL constraint failed: TestDescriptor.name");
            expect(await tdController.updateTestDescriptor(mockReq(1, {
                newName: undefined,
                newIdSKU: 1,
                newProcedureDescription: "New This test is described by ..."
            }, 1), mockRes)).toBe("generic error");
        });

        test("reqWithEmptyNewProcedureDescriptor", async () => {
            expect(await db.updateTestDescriptor({
                newName: "New Test Descriptor 1", newIdSKU: 1, newProcedureDescription: undefined
            }, 1).catch(err => err.toString())).toStrictEqual("Error: SQLITE_CONSTRAINT: NOT NULL constraint failed: TestDescriptor.procedureDescription");
            expect(await tdController.updateTestDescriptor(mockReq(1, {
                newName: "New Test Descriptor 1",
                newIdSKU: 1,
                newProcedureDescription: undefined,
            }, 1), mockRes)).toBe("generic error");
        });
    });

    describe("updateTestDescriptor White Box", () => {

        init_test();

        test("updateTestDescriptor Dropped Table", async () => {
            await db.dropTable();
            expect(await db.updateTestDescriptor({
                newName: "New Test Descriptor 1", newIdSKU: 1, newProcedureDescription: "New This test is described by ..."
            }, 1).catch(err => err.toString())).toBe("Error: SQLITE_ERROR: no such table: TestDescriptor");
            expect(await db.getTestDescriptors().catch(err => err.toString())).toBe("Error: SQLITE_ERROR: no such table: TestDescriptor");
            expect(await tdController.getTestDescriptorById(
                mockReq(1, undefined),
                mockRes))
                .toEqual("generic error");
            expect(await db.getTestDescriptorById(1).catch(err => err.toString())).toBe("Error: SQLITE_ERROR: no such table: TestDescriptor");
        });

        test("updateTestDescriptor id does not exist", () => {
            expect(async () => await db.updateTestDescriptor({
                newName: "New Test Descriptor 1", newIdSKU: 1, newProcedureDescription: "New This test is described by ..."
            }, 99)).rejects.toBe(404)
        });

        test("updateTestDescriptor foreign key constraint", async () => {
            expect(await db.updateTestDescriptor({
                newName: "New Test Descriptor 1", newIdSKU: 99, newProcedureDescription: "New This test is described by ..."
            }, 1).catch(err => err.toString())).toBe("Error: SQLITE_CONSTRAINT: FOREIGN KEY constraint failed")
        });
    });

    describe("deleteTestDescriptor Black Box", () => {

        init_test();

        test("reqWithCorrectData", async () => {
            expect(await db.deleteTestDescriptor(1)).toBe(1);
            expect(await tdController.deleteTestDescriptor(mockReq(1), mockRes)).toBe("no id associated test descriptor");
            expect(await db.getTestDescriptorById(1).catch(err => err.toString())).toBe("404");
            expect(await db.getTestDescriptors()).toEqual([{
                id: 2, name: "Test Descriptor 2", idSKU: 2, procedureDescription: "This test is described by ..."
            }]);
            expect(await tdController.getTestDescriptors(undefined, mockRes)).toEqual(200);
            expect(await tdController.getTestDescriptorById(
                mockReq(1, undefined),
                mockRes))
                .toEqual("no test descriptor associated id");
            });

        test("reqWithNonIntegerId", async () => {
            expect(await db.deleteTestDescriptor("Not Integer").catch(err => err.toString())).toBe("404");
            expect(await db.getTestDescriptorById(1)).toEqual({
                id: 1, name: "Test Descriptor 1", idSKU: 1, procedureDescription: "This test is described by ..."
            });
            expect(await db.getTestDescriptors()).toEqual([{
                id: 1, name: "Test Descriptor 1", idSKU: 1, procedureDescription: "This test is described by ..."
            }, {
                id: 2, name: "Test Descriptor 2", idSKU: 2, procedureDescription: "This test is described by ..."
            }]);
        });

        test("reqWithZeroId", async () => {
            await expect(async () => await db.deleteTestDescriptor(0)).rejects.toBe(404);
            await expect(await db.getTestDescriptorById(1)).toEqual({
                id: 1, name: "Test Descriptor 1", idSKU: 1, procedureDescription: "This test is described by ..."
            });
            expect(await db.getTestDescriptors()).toEqual([{
                id: 1, name: "Test Descriptor 1", idSKU: 1, procedureDescription: "This test is described by ..."
            }, {
                id: 2, name: "Test Descriptor 2", idSKU: 2, procedureDescription: "This test is described by ..."
            }]);
        });
    });

    describe("deleteTestDescriptor White Box", () => {

        init_test();

        test("deleteTestDescriptor id do not exist", () => {
            expect(async () => await db.deleteTestDescriptor(99)).rejects.toBe(404);
        });
    });

    describe("General TestDescriptor White Box", () => {

        init_test();

        test("addTestDescriptor foreign key constraint", async () => {
            await expect(await db.addTestDescriptor({
                name: "Test Descriptor 2", idSKU: 99, procedureDescription: "This test is described by ..."
            }).catch(err => err.toString()))
                .toBe("Error: SQLITE_CONSTRAINT: FOREIGN KEY constraint failed");
        });

        test("deleteTestDescriptorData dropped table", async () => {
            await db.dropTable();
            await expect(await db.deleteTestDescriptordata().catch(err => err.toString()))
                .toBe("Error: SQLITE_ERROR: no such table: TestDescriptor");
            expect(await tdController.deleteTestDescriptor(mockReq(1), mockRes)).toBe("generic error");
            expect(await tdController.getTestDescriptorById(
                mockReq(1, undefined),
                mockRes))
                .toEqual("generic error");
        });

        test("repopulateDataBase id conflict", async () => {
            await expect(await db.repopulateDataBase().catch(err => err.toString()))
                .toBe("Error: SQLITE_CONSTRAINT: UNIQUE constraint failed: SKU.id");
        });

    });
});

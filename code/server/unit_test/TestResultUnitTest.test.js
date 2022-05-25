const trDAO = require('../persistence/testResultRepository')
const tdDAO = require('../persistence/testDescriptorRepository')
const dbDAO = require('../persistence/DBHandler')
const trController = require('../controllers/testResultController')
const db = new trDAO();
const dbTd = new tdDAO();
const dbHandler = new dbDAO();

const mockReq = (id, rfid, tr) => { return ({
    params: { id: id, rfid: rfid },
    body: tr
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

    beforeEach(async () => {
        await db.addTestResult({
            "rfid": "12345678901234567890123456789016", "idTestDescriptor": 1, "Date": "2021/11/28", "Result": true
        });
        await trController.addTestResult(mockReq(undefined, undefined, {
            "rfid": "12345678901234567890123456789017", "idTestDescriptor": 2, "Date": "2020/11/28", "Result": false
        }), mockRes);
    });

    afterEach(async () => {
        await db.newTestResultTable();
        await db.deleteTestResultdata();
    });
}

describe('Test Result Unit Test', () => {

    beforeAll(async () => {
        await dbHandler.deleteAllTablesData();
        await dbTd.repopulateDataBase();
        await dbTd.addTestDescriptor({
            name: "Test Descriptor 1", idSKU: 1, procedureDescription: "This test is described by ..."
        });
        await dbTd.addTestDescriptor({
            name: "Test Descriptor 2", idSKU: 2, procedureDescription: "This test is described by ..."
        });
    });

    describe("updateTestResult Black Box", () => {

        init_test();

        test("updateTestResult reqWithCorrectData", async () => {
            expect(await db.updateTestResult(1, {
                newDate: "2022/05/20", newIdTestDescriptor: 1, newResult: true
            }))
                .toEqual({
                    newDate: "2022/05/20", newIdTestDescriptor: 1, newResult: true
                });
            expect(await db.getTestResultById(1))
                .toEqual({
                    "id": 1, "Date": "2022/05/20", "idTestDescriptor": 1, "Result": true
                });
            expect(await trController.getTestResultById(
                mockReq(1, "12345678901234567890123456789016",undefined),
                mockRes)).toBe(200);
            expect(await db.getTestResults())
                .toEqual([{
                    "id": 1, "Date": "2022/05/20", "idTestDescriptor": 1, "Result": true
                }, {
                    "id": 2, "Date": "2020/11/28", "idTestDescriptor": 2, "Result": false
                }])
            expect(await trController.getTestResults(mockReq(undefined, "12345678901234567890123456789016",undefined), mockRes))
                .toBe(200);
        });

        test("updateTestResult reqWithNonIntegerID", async () => {
            expect(await db.updateTestResult("Not Integer", {
                newDate: "2022/05/20", newIdTestDescriptor: 1, newResult: true
            }).catch(err => err.toString())).toBe("404");
            expect(await db.updateTestResult(mockReq(1, "12345678901234567890123456789016", {
                newDate: "2022/05/20", newIdTestDescriptor: 1, newResult: true
            }), mockRes).catch(err => err.toString())).toBe("404");
        });

        test("updateTestResult reqWithZeroID", async () => {
            expect(await db.updateTestResult(0, {
                newDate: "2022/05/20", newIdTestDescriptor: 1, newResult: true
            }).catch(err => err.toString())).toBe("404");
        });

        test("updateTestResult reqWithNonIntegerNewIdTestDescriptor", async () => {
            await expect(await db.updateTestResult(1, {
                newDate: "2022/05/20", newIdTestDescriptor: "Non Integer", newResult: true
            }).catch(err => err.toString())).toBe("Error: SQLITE_CONSTRAINT: FOREIGN KEY constraint failed");
            expect(await db.updateTestResult(mockReq(1, "12345678901234567890123456789016", {
                newDate: "2022/05/20", newIdTestDescriptor: "Non Integer", newResult: true
            }), mockRes).catch(err => err.toString())).toBe("404");
        });

        test("updateTestResult reqWithZeroNewIdTestDescriptor", async () => {
            await expect(await db.updateTestResult(1, {
                newDate: "2022/05/20", newIdTestDescriptor: 0, newResult: true
            }).catch(err => err.toString())).toBe("Error: SQLITE_CONSTRAINT: FOREIGN KEY constraint failed");
        });

        test("updateTestResult reqWithNonDateNewDate", async () => {
            await expect(await db.updateTestResult(1, {
                newDate: "Not Date", newIdTestDescriptor: 1, newResult: true
            }).catch(err => err.toString()))
                .toBe("Error: SQLITE_CONSTRAINT: NOT NULL constraint failed: TestResult.Date");
            expect(await db.updateTestResult(mockReq(1, "12345678901234567890123456789016", {
                newDate: "Not Date", newIdTestDescriptor: 1, newResult: true
            }), mockRes).catch(err => err.toString())).toBe("404");
        });

        test("updateTestResult reqWithNonBooleanNewResult", async () => {
            await expect(await db.updateTestResult(1, {
                newDate: "2022/05/20", newIdTestDescriptor: 1, newResult: "Not boolean"
            }).catch(err => err.toString()))
                .toBe("Error: SQLITE_CONSTRAINT: NOT NULL constraint failed: TestResult.Result");
        });

    });

    describe("deleteTestResult Black Box", () => {

        init_test();

        test("reqWithCorrectData", async () => {
            expect(await db.deleteTestResult(1)).toBe(1);
            expect(await db.getTestResultById(1).catch(err => err.toString())).toBe("404");
            expect(await trController.getTestResultById(mockReq(1, "12345678901234567890123456789016", undefined), mockRes)
                .catch(err => err.toString())).toBe("no test result associated to id");
            expect(await db.getTestResults()).toEqual([{
                "id": 2, "Date": "2020/11/28", "idTestDescriptor": 2, "Result": false
            }]);
        });

        test("reqWithNonIntegerId", async () => {
            expect(await db.deleteTestResult("Not Integer").catch(err => err.toString())).toBe("404");
        });

        test("reqWithZeroId", async () => {
            await expect(await db.deleteTestResult(0).catch(err => err.toString())).toBe("404");
        });
    });

    describe("TestResult General White Box", () => {

        init_test();


        test("updateTestResult id does not exist", async () => {
            expect(await db.updateTestResult(99, {
                "newIdTestDescriptor": 1, "newDate": "2021/11/28", "newResult": true
            }).catch(err => err.toString()))
                .toBe("404");
            expect(await trController.updateTestResult(mockReq(
                99,
                "12345678901234567890123456789016",
                { "newIdTestDescriptor": 1, "newDate": "2021/11/28", "newResult": true }
                ), mockRes)
            .catch(err => err.toString()))
                .toBe("no test result associated to id");
        });

        test("updateTestResult newIdDescriptor does not exist", async () => {
            expect(await trController.updateTestResult(mockReq(
                1,
                "12345678901234567890123456789016",
                { "newIdTestDescriptor": 99, "newDate": "2021/11/28", "newResult": true }
            ), mockRes)
                .catch(err => err.toString()))
                .toBe("no test descriptor associated to idTestDescriptor");
        });

        test("updateTestResult RFID does not exist", async () => {
            expect(await trController.updateTestResult(mockReq(
                1,
                "12345678901234567890123456789099",
                { "newIdTestDescriptor": 1, "newDate": "2021/11/28", "newResult": true }
            ), mockRes)
                .catch(err => err.toString()))
                .toBe("no sku item associated to rfid");
        });

        test("updateTestResult newIdTestDescriptor non existent", async () => {
            expect(await trController.updateTestResult(mockReq(
                1,
                "12345678901234567890123456789021",
                { "newIdTestDescriptor": 99, "newDate": "2021/11/28", "newResult": true }
            ), mockRes)
                .catch(err => err.toString()))
                .toBe("no test descriptor associated to idTestDescriptor");
        });

        test("updateTestResult SKU Item does not have the right descriptor", async () => {
            expect(await trController.updateTestResult(mockReq(
                1,
                "12345678901234567890123456789021",
                { "newIdTestDescriptor": 1, "newDate": "2021/11/28", "newResult": true }
            ), mockRes)
                .catch(err => err.toString()))
                .toBe("no test description attached to this SKU Item");
        });

        test("getTestResultsByRFID RFID does not exist", async () => {
            expect(await trController.getTestResultsByRFID(mockReq(
                1,
                "12345678901234567890123456789099",
                undefined
            ), mockRes)
                .catch(err => err.toString()))
                .toBe("no sku item associated to rfid");
        });

        test("getTestResultsByRFID SKU Item has no test descriptors", async () => {
            expect(await trController.getTestResultsByRFID(mockReq(
                1,
                "12345678901234567890123456789018",
                undefined
            ), mockRes)
                .catch(err => err.toString()))
                .toBe("no test descriptor associated to idTestDescriptor");
        });

        test("addTestResultsByRFID RFID does not exist", async () => {
            expect(await trController.addTestResult(mockReq(
                undefined,
                undefined,
                { "rfid": "12345678901234567890123456789099", "idTestDescriptor": 1, "Date": "2021/11/28", "Result": true }
            ), mockRes)
                .catch(err => err.toString()))
                .toBe("no sku item associated to rfid");
        });

        test("addTestResultsByRFID idTestDescriptor non existent", async () => {
            expect(await trController.addTestResult(mockReq(
                undefined,
                undefined,
                { "rfid": "12345678901234567890123456789016", "idTestDescriptor": 99, "Date": "2021/11/28", "Result": true }
            ), mockRes)
                .catch(err => err.toString()))
                .toBe("no test descriptor associated to idTestDescriptor");
        });

        test("getTestResultsByTdId TdId does not exist", async () => {
            expect(await db.getTestResultsByTdId(99).catch(err => err.toString()))
                .toBe("404");
        });

        test("deleteTestResult id does not exist", async () => {
            expect(await db.deleteTestResult(99).catch(err => err.toString()))
                .toBe("404");
            expect(await trController.deleteTestResult(mockReq(
                99, "12345678901234567890123456789016", undefined),
            mockRes).catch(err => err.toString()))
                .toBe("no test result associated to id");
        });

        test("getTestResults consistency test", async () => {
            const getTRsFromTable = await db.getTestResults();
            const getTRsByRFID = await db.getTestResultsByRfid("12345678901234567890123456789016");
            const getTRsFromTableWithController = await trController.getTestResults(
                mockReq(undefined, "12345678901234567890123456789016", undefined),
                mockRes).catch(err => err.toString());
            const getTRsByRFIDWithController = await trController.getTestResultsByRFID(
                mockReq(undefined, "12345678901234567890123456789016", undefined),
                mockRes).catch(err => err.toString());
            expect(getTRsFromTableWithController).toStrictEqual(getTRsByRFIDWithController);
            expect(getTRsFromTable[0]).toStrictEqual(getTRsByRFID[0]);
        });
    });

    describe("TestResult Dropped Table White Box", () => {

        init_test();


        test("addTestResult dropped table", async () => {
            await db.dropTable();
            expect(await db.addTestResult({
                "rfid": "12345678901234567890123456789016", "idTestDescriptor": 1, "Date": "2021/11/28", "Result": true
            }).catch(err => err.toString()))
                .toBe("Error: SQLITE_ERROR: no such table: TestResult");
        });

        test("updateTestResult dropped table", async () => {
            await db.dropTable();
            expect(await db.updateTestResult(1, {
                "newIdTestDescriptor": 1, "newDate": "2021/11/28", "newResult": true
            }).catch(err => err.toString()))
                .toBe("Error: SQLITE_ERROR: no such table: TestResult");
            expect(await trController.updateTestResult(mockReq(
                    1, "12345678901234567890123456789016",
                    {
                        "newIdTestDescriptor": 1, "newDate": "2021/11/28", "newResult": true
                    }),
                mockRes).catch(err => err.toString()))
                .toBe("generic error");
        });

        test("deleteTestResult dropped table", async () => {
            await db.dropTable();
            expect(await db.deleteTestResult(1).catch(err => err.toString()))
                .toBe("Error: SQLITE_ERROR: no such table: TestResult");
            expect(await trController.deleteTestResult(mockReq(
                    1, "12345678901234567890123456789016", undefined),
                mockRes).catch(err => err.toString()))
                .toBe("generic error");
        });

        test("getTestResults dropped table", async () => {
            await db.dropTable();
            expect(await db.getTestResults().catch(err => err.toString()))
                .toBe("Error: SQLITE_ERROR: no such table: TestResult");
            expect(await trController.getTestResults(
                mockReq(undefined, "12345678901234567890123456789016", undefined),
                mockRes).catch(err => err.toString()))
                .toBe("generic error");
        });

        test("getTestResultById dropped table", async () => {
            await db.dropTable();
            expect(await db.getTestResultById(1).catch(err => err.toString()))
                .toBe("Error: SQLITE_ERROR: no such table: TestResult");
            expect(await trController.getTestResultById(
                mockReq(1, "12345678901234567890123456789016", undefined),
                mockRes).catch(err => err.toString()))
                .toBe("generic error");
        });

        test("getTestResultByTdId dropped table", async () => {
            await db.dropTable();
            expect(await db.getTestResultsByTdId(1).catch(err => err.toString()))
                .toBe("Error: SQLITE_ERROR: no such table: TestResult");
        });

    });

    describe("TestResult Foreign Keys White Box", () => {

        init_test();

        test("addTestResult foreign key constraint", async () => {
            await expect(await db.addTestResult({
                "rfid": "12345678901234567890123456789016", "idTestDescriptor": 99, "Date": "2021/11/28", "Result": true
            }).catch(err => err.toString()))
                .toBe("Error: SQLITE_CONSTRAINT: FOREIGN KEY constraint failed");
        });

        test("updateTestResult foreign key constraint", async () => {
            await expect(await db.updateTestResult(1, {
                "newIdTestDescriptor": 99, "newDate": "2021/11/28", "newResult": true
            }).catch(err => err.toString()))
                .toBe("Error: SQLITE_CONSTRAINT: FOREIGN KEY constraint failed");
        });

    });

    describe("getTestDescriptorIdsByTdId Black box", () => {

        init_test();

        test("reqWithCorrectData", async () => {
            expect(await db.getTestResultsByTdId(2)).toEqual([{
                "id": 2, "idTestDescriptor": 2, "Date": "2020/11/28", "Result": false
            }]);
        });

        test("reqWithIncorrectData", async () => {
            expect(await db.getTestResultsByTdId("Not Integer")
                .catch(err => err.toString()))
                .toBe("404");
        });
    });
});
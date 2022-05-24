const trDAO = require('../persistence/testResultRepository')
const tdDAO = require('../persistence/testDescriptorRepository')
const dbDAO = require('../persistence/DBHandler')
const db = new trDAO();
const dbTd = new tdDAO();
const dbHandler = new dbDAO();

describe('Test Result Unit Test', () => {

    beforeAll(async () => {
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
        await dbTd.addTestDescriptor({
            name: "Test Descriptor 1", idSKU: 1, procedureDescription: "This test is described by ..."
        });
        await dbTd.addTestDescriptor({
            name: "Test Descriptor 2", idSKU: 2, procedureDescription: "This test is described by ..."
        });
        await db.addTestResult({
            "rfid": "12345678901234567890123456789016", "idTestDescriptor": 1, "Date": "2021/11/28", "Result": true
        });
        await db.addTestResult({
            "rfid": "12345678901234567890123456789017", "idTestDescriptor": 2, "Date": "2020/11/28", "Result": false
        });
    });

    afterAll(async () => {
        await db.newTestResultTable();
        await dbTd.newTestDescriptorTable();
        await dbHandler.deleteAllTablesData();
        await dbTd.repopulateDataBase();
    });

    describe("updateTestResult Black Box", () => {


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
            expect(await db.getTestResults())
                .toEqual([{
                    "id": 1, "Date": "2022/05/20", "idTestDescriptor": 1, "Result": true
                }, {
                    "id": 2, "Date": "2020/11/28", "idTestDescriptor": 2, "Result": false
                }])
        });

        test("updateTestResult reqWithNonIntegerID", async () => {
            expect(await db.updateTestResult("Not Integer", {
                newDate: "2022/05/20", newIdTestDescriptor: 1, newResult: true
            }).catch(err => err.toString())).toBe("404");
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
        });

        test("updateTestResult reqWithNonBooleanNewResult", async () => {
            await expect(await db.updateTestResult(1, {
                newDate: "2022/05/20", newIdTestDescriptor: 1, newResult: "Not boolean"
            }).catch(err => err.toString()))
                .toBe("Error: SQLITE_CONSTRAINT: NOT NULL constraint failed: TestResult.Result");
        });

    });

    describe("deleteTestResult Black Box", () => {

        test("reqWithCorrectData", async () => {
            expect(await db.deleteTestResult(1)).toBe(1);
            expect(await db.getTestResultById(1).catch(err => err.toString())).toBe("404");
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


        test("updateTestResult id does not exist", async () => {
            expect(await db.updateTestResult(99, {
                "newIdTestDescriptor": 1, "newDate": "2021/11/28", "newResult": true
            }).catch(err => err.toString()))
                .toBe("404");
        });

        test("getTestResultsByTdId TdId does not exist", async () => {
            expect(await db.getTestResultsByTdId(99).catch(err => err.toString()))
                .toBe("404");
        });

        test("deleteTestResult id does not exist", async () => {
            expect(await db.deleteTestResult(99).catch(err => err.toString()))
                .toBe("404");
        });

        test("getTestResults consistency test", async () => {
            const getTRsFromTable = await db.getTestResults();
            const getTRsByRFID = await db.getTestResultsByRfid("12345678901234567890123456789016");
            expect(getTRsFromTable[0]).toStrictEqual(getTRsByRFID[0]);
        });
    });

    describe("TestResult Dropped Table White Box", () => {


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
        });

        test("deleteTestResult dropped table", async () => {
            await db.dropTable();
            expect(await db.deleteTestResult(1).catch(err => err.toString()))
                .toBe("Error: SQLITE_ERROR: no such table: TestResult");
        });

        test("getTestResults dropped table", async () => {
            await db.dropTable();
            expect(await db.getTestResults().catch(err => err.toString()))
                .toBe("Error: SQLITE_ERROR: no such table: TestResult");
        });

        test("getTestResultById dropped table", async () => {
            await db.dropTable();
            expect(await db.getTestResultById(1).catch(err => err.toString()))
                .toBe("Error: SQLITE_ERROR: no such table: TestResult");
        });

        test("getTestResultByTdId dropped table", async () => {
            await db.dropTable();
            expect(await db.getTestResultsByTdId(1).catch(err => err.toString()))
                .toBe("Error: SQLITE_ERROR: no such table: TestResult");
        });

    });

    describe("TestResult Foreign Keys White Box", () => {

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
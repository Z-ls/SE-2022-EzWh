const tdDao = require('../persistence/testDescriptorRepository');
const dbDAO = require('../persistence/DBHandler')
const express = require('express');
const db = new tdDao();
const dbHandler = new dbDAO();

describe('Test Descriptor Unit Test', () => {

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
        await db.addTestDescriptor({
            name: "Test Descriptor 2", idSKU: 2, procedureDescription: "This test is described by ..."
        });
    });

    afterAll(async () => {
        await db.newTestDescriptorTable();
        await dbHandler.deleteAllTablesData();
        await db.repopulateDataBase();
    });

    describe("updateTestDescriptor Black Box", () => {

        test("reqWithCorrectData", async () => {
            await db.updateTestDescriptor({
                newName: "New Test Descriptor 1", newIdSKU: 1, newProcedureDescription: "New This test is described by ..."
            }, 1);
            expect(await db.getTestDescriptorById(1)).toEqual({
                id: 1,
                "name": "New Test Descriptor 1",
                "idSKU": 1,
                "procedureDescription": "New This test is described by ..."
            });
        });

        test("reqWithNonIntegerId", () => {
            expect(async () => await db.updateTestDescriptor({
                newName: "New Test Descriptor 1", newIdSKU: 1, newProcedureDescription: "New This test is described by ..."
            }, "Not Integer")).rejects.toBe(404);
        });

        test("reqWithZeroId", () => {
            expect(async () => await db.updateTestDescriptor({
                newName: "New Test Descriptor 1", newIdSKU: 1, newProcedureDescription: "New This test is described by ..."
            }, 0)).rejects.toBe(404);
        });

        test("reqWithNonIntegerNewIdSKU", async () => {
            expect(await db.updateTestDescriptor({
                newName: "New Test Descriptor 1",
                newIdSKU: "Not Integer",
                newProcedureDescription: "New This test is described by ..."
            }, 1).catch(err => err.toString())).toStrictEqual("Error: SQLITE_CONSTRAINT: FOREIGN KEY constraint failed");
        });

        test("reqWithZeroNewIdSKU", async () => {
            expect(await db.updateTestDescriptor({
                newName: "New Test Descriptor 1", newIdSKU: 0, newProcedureDescription: "New This test is described by ..."
            }, 1).catch(err => err.toString())).toStrictEqual("Error: SQLITE_CONSTRAINT: FOREIGN KEY constraint failed");
        });

        test("reqWithEmptyNewName", async () => {
            expect(await db.updateTestDescriptor({
                newName: undefined, newIdSKU: 1, newProcedureDescription: "New This test is described by ..."
            }, 1).catch(err => err.toString())).toStrictEqual("Error: SQLITE_CONSTRAINT: NOT NULL constraint failed: TestDescriptor.name");
        });

        test("reqWithEmptyNewProcedureDescriptor", async () => {
            expect(await db.updateTestDescriptor({
                newName: "New Test Descriptor 1", newIdSKU: 1, newProcedureDescription: undefined
            }, 1).catch(err => err.toString())).toStrictEqual("Error: SQLITE_CONSTRAINT: NOT NULL constraint failed: TestDescriptor.procedureDescription");
        });
    });

    describe("updateTestDescriptor White Box", () => {

        test("updateTestDescriptor Dropped Table", async () => {
            await db.dropTable();
            expect(await db.updateTestDescriptor({
                newName: "New Test Descriptor 1", newIdSKU: 1, newProcedureDescription: "New This test is described by ..."
            }, 1).catch(err => err.toString())).toBe("Error: SQLITE_ERROR: no such table: TestDescriptor");
            expect(await db.getTestDescriptors().catch(err => err.toString())).toBe("Error: SQLITE_ERROR: no such table: TestDescriptor");
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

        test("reqWithCorrectData", async () => {
            expect(await db.deleteTestDescriptor(1)).toBe(1);
            expect(await db.getTestDescriptorById(1).catch(err => err.toString())).toBe("404");
            expect(await db.getTestDescriptors()).toEqual([{
                id: 2, name: "Test Descriptor 2", idSKU: 2, procedureDescription: "This test is described by ..."
            }]);
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

        test("deleteTestDescriptor id do not exist", () => {
            expect(async () => await db.deleteTestDescriptor(99)).rejects.toBe(404);
        });
    });

    describe("General TestDescriptor White Box", () => {

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
        });

        test("repopulateDataBase id conflict", async () => {
            await expect(await db.repopulateDataBase().catch(err => err.toString()))
                .toBe("Error: SQLITE_CONSTRAINT: UNIQUE constraint failed: SKU.id");
        });

    });
});

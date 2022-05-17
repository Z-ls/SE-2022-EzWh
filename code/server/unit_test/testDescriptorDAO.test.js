const tdDao = require('../persistence/testDescriptorRepository');
const db = new tdDao();

const tdFactory = (n) => {
    return ({
        "name": `test descriptor ${n}`,
        "procedureDescription": "This test is described by...",
        "idSKU": n
    });
};

const nTdFactory = (n) => {
    return ({
        "newName": `test descriptor ${n*10}`,
        "newProcedureDescription": "This test is described by...",
        "newIdSKU": n
    });
}

describe("Test Descriptor DAO Test", () => {

    beforeAll(async () => {
        await db.dropTable();
        await db.newTestDescriptorTable();
    });

    test("ADD Test Descriptors", async () => {
        let req = Array
            .from({length: 5}, (x, i) => i + 1)
            .map(n => tdFactory(n));
        expect(await db.addTestDescriptor(req[0]))
            .toBe(1);
        expect(await db.addTestDescriptor(req[1]))
            .toBe(2);
        expect(await db.addTestDescriptor(req[2]))
            .toBe(3);
        expect(await db.addTestDescriptor(req[3]))
            .toBe(4);
        expect(await db.addTestDescriptor(req[4]))
            .toBe(5);
    })

    test("GET All Test Descriptors", async () => {
        expect(await db.getTestDescriptors()).toEqual(
            Array.from({length: 5}, (x, i) => i + 1).map(i =>
                ({
                        id: i,
                        idSKU: i,
                        name: `test descriptor ${i}`,
                        procedureDescription: "This test is described by..."
                })
            )
        )
    });
        
    test("UPDATE Test Descriptor", async () => {
        const req = Array
            .from({length: 5}, (x, i) => i + 1)
            .map(n => nTdFactory(n));
        expect(await db.updateTestDescriptor(nTdFactory(0), 1))
        .toBe(1);
        expect(await db.updateTestDescriptor(nTdFactory(1), 2))
        .toBe(2);
        expect(await db.updateTestDescriptor(nTdFactory(2), 3))
        .toBe(3);
        expect(await db.updateTestDescriptor(nTdFactory(3), 4))
        .toBe(4);
        expect(await db.updateTestDescriptor(nTdFactory(4), 5))
        .toBe(5);
    })

    test("GET Test Descriptor By Id", async () => {
        expect(await db.getTestDescriptor(1)).toEqual(
            {
                id: 1,
                idSKU: 0,
                name: "test descriptor 0",
                procedureDescription: "This test is described by..."
            }
        );
        expect(await db.getTestDescriptor(2)).toEqual(
            {
                id: 2,
                idSKU: 1,
                name: "test descriptor 10",
                procedureDescription: "This test is described by..."
            }
        );
        expect(await db.getTestDescriptor(3)).toEqual(
            {
                id: 3,
                idSKU: 2,
                name: "test descriptor 20",
                procedureDescription: "This test is described by..."
            }
        );

        expect(await db.getTestDescriptor(4)).toEqual(
            {
                id: 4,
                idSKU: 3,
                name: "test descriptor 30",
                procedureDescription: "This test is described by..."
            }
        );

        expect(await db.getTestDescriptor(5)).toEqual(
            {
                id: 5,
                idSKU: 4,
                name: "test descriptor 40",
                procedureDescription: "This test is described by..."
            }
        );
        
    });

    test("DELETE Test Descriptor", async () => {
        expect(await db.deleteTestDescriptor(1)).toBe(1);
        expect(await db.deleteTestDescriptor(2)).toBe(2);
        expect(await db.deleteTestDescriptor(3)).toBe(3);
        expect(await db.deleteTestDescriptor(4)).toBe(4);
        expect(await db.deleteTestDescriptor(5)).toBe(5);
    })

    afterAll(async () => {
        await db.dropTable();
    });
    
});
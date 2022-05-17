const tdController = require('../controllers/testDescriptorController');
const tdRepo = require('../persistence/testDescriptorRepositoryMock');

describe('Get api/TestDescriptors/', () => {
    beforeEach(() => {
        tdRepo.getTestDescriptors.mockReset();
        tdRepo.getTestDescriptors.mockReturnValueOnce(
            [
                {
                    "id":1,
                    "name":"test descriptor 1",
                    "procedureDescription": "This test is described by...",
                    "idSKU" :1
        
                },
                {
                    "id":2,
                    "name":"test descriptor 2",
                    "procedureDescription": "This test is described by...",
                    "idSKU" :2
                }
            ]
        ).mockReturnValue(
            {
                "id":2,
                "name":"test descriptor 2",
                "procedureDescription": "This test is described by...",
                "idSKU" :2
            }
        );
    });

    test('Get Test Descriptors', async () => {
        let res = await tdRepo.getTestDescriptors();
        expect(res).toStrictEqual(
            [
                {
                    "id":1,
                    "name":"test descriptor 1",
                    "procedureDescription": "This test is described by...",
                    "idSKU" :1
        
                },
                {
                    "id":2,
                    "name":"test descriptor 2",
                    "procedureDescription": "This test is described by...",
                    "idSKU" :2
                }
            ]
        );
    });
});

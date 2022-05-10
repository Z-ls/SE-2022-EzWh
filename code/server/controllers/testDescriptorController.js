const TestDescriptor = require('../model/TestDescriptor');
const UserDAO = require('../persistence/testDescriptorRepository');
const db = new UserDAO();

//GET: Test Descriptors
const getTestDescriptors = async (req, res, err) => {
    let ret = await db.getTestDescriptors().catch(err);
    return (ret ? res.status(200).json(ret) : res.status(500).send("Generic Error."));
}

//GET: Test Descriptor By ID
const getTestDescriptorById = async (req, res, err) => {
    if (isNaN(req.params.id))
        return res.status(422).send("validation of id failed");
    let ret = await db.getTestDescriptor(req.params.id).catch(err);
    return (ret ? res.status(200).json(ret) : res.status(404).send("no test descriptor associated id"));
}

//POST: New Test Descriptor
const addTestDescriptor =  async (req, res, err) => {
    if (isNaN(req.body.idSKU))
        return res.status(422).send("validation of request body failed");
    // if (!await db.getSKUById(req.body.idSKU).catch(err))
    //     return res.status(404).send("no sku associated idSKU");
    await db.newTestDescriptorTable().catch(err);
    let nTD = new TestDescriptor(
        req.body.name,
        req.body.procedureDescription,
        req.body.idSKU
    );
    return (await db.addTestDescriptor(nTD).catch(err) ?
        res.status(201).json(req.body):
        res.status(503).send(`POST: /api/testDescriptor Failed`));
}

//PUT: Update Test Descriptor
const updateTestDescriptor = async (req, res, err) => {
    if (isNaN(req.body.newIdSKU) || isNaN(req.params.id))
        return res.status(422).send("validation of request body or of id failed");
    // if (!await db.getSKUById(req.body.newIdSKU).catch(err))
    //     return res.status(404).send("no sku associated idSKU");
    let nTD = new TestDescriptor(
        req.body.newName,
        req.body.newProcedureDescription,
        req.body.newIdSKU
    );
    let ret = await db.updateTestDescriptor(nTD, req.params.id).catch(err);
    return (ret ? res.status(201).json(ret) :
        res.status(503).send("Generic Error."));
}

//DELETE: Delete Test Descriptor
const deleteTestDescriptor = async(req, res, err) => {
    if (isNaN(req.params.id))
        return res.status(422).send("validation of request body or of id failed");
    let ret = await db.deleteTestDescriptor(req.params.id).catch(err);
    return ( ret ? res.status(204).json(ret) :
        res.status(503).send("generic error"));
}

module.exports = {
    getTestDescriptors,
    getTestDescriptorById,
    addTestDescriptor,
    updateTestDescriptor,
    deleteTestDescriptor
}
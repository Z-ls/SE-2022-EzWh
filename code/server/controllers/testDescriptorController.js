const testDescriptorRepository = require('../persistence/testDescriptorRepository');
const db = new testDescriptorRepository();

// GET: Test Descriptors
// Test Descriptions as JSON on success
// 500 on generic error
const getTestDescriptors = async (req, res, err) => {
    let ret = await db.getTestDescriptors().catch(err);
    return ret ?
        res.status(200).json(ret) :
        res.status(500).send("generic error");
}

// GET: Test Descriptor By ID
// Test Description as JSON on success
// 422 on IDs failing validations
// 404 on empty result
const getTestDescriptorById = async (req, res, err) => {
    if (isNaN(req.params.id))
        return res.status(422).send("validation of id failed");
    let ret = await db.getTestDescriptor(req.params.id).catch(err);
    if(!ret)
        return res.status(404).send("no test descriptor associated id");
    switch(ret) {
    case "500":
        return res.status(500).send("generic error");
    // case "404":
    //     return res.status(404).send("no test descriptor associated id");
    default:
        return res.status(200).json(ret);
    }
}

//POST: New Test Descriptor
// ID of added descriptor on success
// 422 on failed ID validation
// 404 on non-existent SKU
// 503 on generic error
const addTestDescriptor =  async (req, res, err) => {
    if (typeof (req.body.idSKU) !== "number" ||
        !req.body.name ||
        !req.body.procedureDescription)
        return res.status(422).send("validation of request body failed");
    let SKU = await db.getSKUById(req.body.idSKU).catch(err);
    if (SKU === "503")
        return res.status(503).send("generic error");
    if (SKU === "404")
        return res.status(404).send("no sku associated idSKU");
    if (!await db.newTestDescriptorTable().catch(err))
        return res.status(503).send("generic error");
    let ret = await db.addTestDescriptor(req.body).catch(err);
    return ret ?
        res.status(201).json(ret) :
        res.status(503).send("generic error");
}

// PUT: Update Test Descriptor
// Requested ID on success
// 422 on failed validations
// 404 on non-existent SKU or non-existent descriptor
// 503 on generic error
const updateTestDescriptor = async (req, res, err) => {
    if (isNaN(req.body.newIdSKU) ||
        !req.body.newName ||
        !req.body.newProcedureDescription
    )
        return res.status(422).send("validation of request body");
    if (isNaN(req.params.id))
        return res.status(422).send("validation of id failed");
    let SKU = await db.getSKUById(req.body.idSKU).catch(err);
    if (SKU === "503")
        return res.status(503).send("generic error");
    if (SKU === "404")
        return res.status(404).send("no sku associated idSKU");
    if (!await db.getTestDescriptor(req.params.id).catch(err))
        return res.status(404).send("no id associated test descriptor");
    let ret = await db.updateTestDescriptor(req.body, req.params.id).catch(err);
    if (!ret)
        return res.status(503).send("generic error");
    // if (ret === "404")
    //     return res.status(404).send("no test descriptor found");
    return res.status(503).json(req.body);
}

// DELETE: Delete Test Descriptor
// Requested ID on success
// 422 on failed validation
// 404 on non-existent descriptor
// 503 on generic error
const deleteTestDescriptor = async(req, res, err) => {
    if (isNaN(req.params.id))
        return res.status(422).send("validation of id failed");
    let idIsValid = await db.getTestDescriptor(req.params.id).catch(err);
    if (!idIsValid)
        return res.status(404).send("no id associated test descriptor");
    let ret = await db.deleteTestDescriptor(req.params.id).catch(err);
    return ret ?
        res.status(204).sendStatus() :
        res.status(503).send("generic error");
}

module.exports = {
    getTestDescriptors,
    getTestDescriptorById,
    addTestDescriptor,
    updateTestDescriptor,
    deleteTestDescriptor
}
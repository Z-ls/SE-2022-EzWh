const TestResult = require('../model/TestResult');
const UserDAO = require('../persistence/testResultRepository');
const tdRepo = require('../persistence/testDescriptorRepository');
const dbTd = new tdRepo();
const db = new UserDAO();

// GET: Test Results
// rfId ==SkuItem==> idSKU ==TestDescriptor==> idTestDescriptor ==TestResult==> Object.TestResult
const getTestResults = async (req, res, err) => {
    // Validation for RFID.
    if (isNaN(req.params.rfid))
        return res.status(422).send("validation of request body or of rfid failed");
    let tdIds = await getTestDescriptorIdsByRFID(req, res, err);
    if (!tdIds)
        return res.status(404).send("no test descriptor associated to idTestDescriptor");
    // Get the list of Test Results for corresponding Test Descriptor ID.
    let trs = await Promise.all(tdIds.map((tdIdArray) => {
        return db.getTestResultsByTdId(tdIdArray.id);
    }))
    // Re-formatting the list and transfer data types.
    let trj = (trs.flat(1).map(tri => { return (
        {
            id: tri.id,
            idTestDescriptor: tri.idTestDescriptor,
            Date: tri.Date,
            Result: tri.Result === "true"
        }
    )}));

    return trj ?
        res.status(200).json(trj) :
        res.status(404).send("no sku item associated to rfid");
}

// GET: Test Result By ID
const getTestResultById = async (req, res, err) => {
    // Validation for RFID and Test Result ID.
    if (isNaN(req.params.id))
        return res.status(422).send("validation of id failed");
    // Validation for RFID.
    if (isNaN(req.params.rfid))
        return res.status(422).send("validation of rfid failed");
    // Get list of SKU Items attached with verified RFID
    let tdIds = await getTestDescriptorIdsByRFID(req, res, err);
    if (!tdIds)
        return res.status(404).send("no test descriptor associated to idTestDescriptor");
    // Get the list of Test Results for corresponding Test Descriptor ID.
    let trs = await Promise.all(tdIds.map((tdIdArray) => {
        return db.getTestResultsByTdId(tdIdArray.id);
    }))
    // Re-formatting the list and transfer data types.
    let trj = (trs.flat(1).map(tri => { return (
        {
            "id": parseInt(tri.id),
            "idTestDescriptor": tri.idTestDescriptor,
            "Date": tri.Date,
            "Result": tri.Result === "true"
        }
    )}));
    // Find in the list the required Test Result with its ID
    let tr = trj.filter(trji => trji.id === Number(req.params.id));
    return tr.length > 0 ?
        res.status(200).json(tr) :
        res.status(404).send("no test result associated to id");
}

// POST: Add Test Result
const addTestResult = async (req, res, err) => {
    // Validation for RFID and Request body.
    if (isNaN(req.body.rfid) ||
        !req.body.idTestDescriptor ||
        !req.body.Date ||
        req.body.Result === undefined)
        return res.status(422).send("validation of request body or of rfid failed");
    // By default, check the existence of table.
    await db.newTestResultTable();
    // Check the authenticity of RFID
    let skuItem = await dbTd.getSKUItemByRfId(req.body.rfid).catch(err);
    if (!skuItem)
        return res.status(404).send("no sku item associated to rfid");
    const ret = await db.addTestResult(req.body).catch(err);
    return ret ?
        res.status(201).json(req.body) :
        res.status(503).send("Generic Error.");
}

// PUT: Update Test Result
const updateTestResult = async (req, res, err) => {
    // Validation for RFID and Request body.
    if (isNaN(req.params.rfid) ||
        !req.body.newIdTestDescriptor ||
        !req.body.newDate ||
        req.body.newResult === undefined)
        return res.status(422).send("validation of request body or of rfid failed");
    // Get list of SKU Items attached with verified RFID
    let skuItem = await dbTd.getSKUItemByRfId(req.params.rfid).catch(err);
    if (!skuItem)
        return res.status(404).send("no sku item associated to rfid");
    // Get the list of Test Results for corresponding Test Descriptor ID.
    let tr = (await Promise.all(skuItem.map((skuItem) => {
        return dbTd.getTestDescriptorIdBySKUId(skuItem.SKUId);
    })).catch(err)).flat(1);
    if (tr.length <= 0)
        return res.status(404).send("no test result associated to id");
    let ret = await db.updateTestResult(req.params.id, req.body).catch(err);
    return ret ?
        res.status(200).json(ret) :
        res.status(503).send("Generic Error.");
}

// DELETE: Delete Test Result
const deleteTestResult = async (req, res, err) => {
    // Validation for ID
    if (isNaN(req.params.id))
        return res.status(422).send("validation of id failed");
    // Validation for RFID
    if (isNaN(req.params.rfid))
        return res.status(422).send("validation of rfid failed");
    // Check the authenticity of ID
    if (!await db.getTestResultById(req.params.id))
        return res.status(404).send("no test result associated to id");
    let ret = await db.deleteTestResult(req.params.id).catch(err);
    return ret ?
        res.status(200).json(ret) :
        res.status(503).send("Generic Error.");
}

const getTestDescriptorIdsByRFID = async (req, res, err) => {
    // Get list of SKU Items attached with verified RFID
    let skuItem = await dbTd.getSKUItemByRfId(req.params.rfid).catch(err);
    if (!skuItem)
        return res.status(404).send("no sku item associated to rfid");
    // Searching for Test Descriptors with SKU IDs,
    // using functions defined in Test Descriptor Controller.
    return (await Promise.all(skuItem.map((skuItem) => {
        return dbTd.getTestDescriptorIdBySKUId(skuItem.SKUId);
    })).catch(err)).flat(1);
}

module.exports = {
    getTestResults,
    getTestResultById,
    addTestResult,
    updateTestResult,
    deleteTestResult
}
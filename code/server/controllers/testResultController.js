const testResultRepository = require('../persistence/testResultRepository');
const testDescriptorRepository = require('../persistence/testDescriptorRepository');
const skuItemRepository = require('../persistence/skuItemRepository');
const skuRepository = require('../persistence/skuRepository');
const { validationResult } = require("express-validator");
const tdRepo = new testDescriptorRepository();
const trRepo = new testResultRepository();
const siRepo = new skuItemRepository();
const skuRepo = new skuRepository();

// GET: Test Results
exports.getTestResults = async (req, res) => {
    if (!validationResult(req).isEmpty())
        return res.status(422).send("validation of request body or of rfid failed");
    try {
        if ((await siRepo.getSingleSKUItem(req.params.rfid).catch(err => { throw err })).length === 0)
            return res.status(404).send("no sku item associated to rfid");
        return await trRepo.getTestResultsByRfid(req.params.rfid).then(rets => {
            return res.status(200).json(rets);
        });
    } catch (err) {
            return res.status(500).send("generic error");
    }
}

// rfId ==SkuItem==> idSKU ==SKU==> testDescriptors ==TestDescriptor==> idTestDescriptor ==TestResult==> Object.TestResult
exports.getTestResultsByRFID = async(req, res) => {
    if (!validationResult(req).isEmpty())
        return res.status(422).send("validation of request body or of rfid failed");
    try {
        let skuItem = await siRepo.getSingleSKUItem(req.params.rfid).catch(err => { throw err });
        if (skuItem.length === 0)
            return res.status(404).send("no sku item associated to rfid");
        // Searching for Test Descriptors with SKU IDs,
        // using functions defined in Test Descriptor Controller.
        let tdIds = await tdRepo.getTestDescriptorIdsBySKUId(skuItem[0].SKUId).catch(err => {
            if (err === 404) return err; else throw (err);});
        if (tdIds === 404)
            return res.status(404).send("no test descriptor associated to idTestDescriptor");
        // Get the list of Test Results for corresponding Test Descriptor ID.
        let trs = await Promise.all(tdIds.map((tdIdArray) => {
            return trRepo.getTestResultsByTdId(tdIdArray.id);
        }));
        // Re-formatting the list and transfer data types.
        let trj = (trs.flat(1).map(tri => {
            return (
                {
                    id: tri.id,
                    idTestDescriptor: tri.idTestDescriptor,
                    Date: tri.Date,
                    Result: tri.Result === "true"
                }
            )
        }));
        return res.status(200).json(trj);
    } catch (err) {
        return res.status(500).send("generic error");
    }
}

// GET: Test Result By ID
exports.getTestResultById = async (req, res) => {
    // Validation for RFID and Test Result ID.
    if (!validationResult(req).isEmpty())
        return res.status(422).send("validation of id or of rfid failed");
    try {
        if ((await siRepo.getSingleSKUItem(req.params.rfid).catch(err => { throw err })).length === 0)
            return res.status(404).send("no sku item associated to rfid");
        return await trRepo.getTestResultById(parseInt(req.params.id)).catch(err => {
            if (err === 404)
                return res.status(404).send("no test result associated to id");
            else { throw err }
        });
    } catch (err) {
        return res.status(500).send("generic error");
    }
}

// POST: Add Test Result
exports.addTestResult = async (req, res) => {
    if (!validationResult(req).isEmpty())
        return res.status(422).send("validation of request body or of rfid failed");
    try {
        // By default, check the existence of table.
        await trRepo.newTestResultTable();
        // Check the authenticity of RFID
        let skuItem = await siRepo.getSingleSKUItem(req.body.rfid).catch(err => { throw err });
        if (skuItem.length === 0)
            return res.status(404).send("no sku item associated to rfid");
        // Check the authenticity of idTestDescriptor
        if (await tdRepo.getTestDescriptorById(req.body.idTestDescriptor).catch(err => {
            if (err === 404) {return err} else {throw err}}) === 404)
            return res.status(404).send("no test descriptor associated to idTestDescriptor");
        // Update the Test Descriptors for the SKU
        let sku = await skuRepo.getSkuById(skuItem[0].SKUId).catch(err => { throw err });
        if (sku.length === 0)
            return res.status(404).send("no SKU associated with this SKU Item");
        sku.testDescriptors = req.body.idTestDescriptor;
        await skuRepo.editSKU(sku, sku.id);
        return await trRepo.addTestResult(req.body).then(() => {
            return res.status(201).end();
        });
    } catch (err) {
            return res.status(503).send("generic error");
    }
}

// PUT: Update Test Result
exports.updateTestResult = async (req, res) => {
    if (!validationResult(req).isEmpty())
        return res.status(422).send("validation of request body or of rfid failed");
    try {
        // Check the authenticity of newIdDescriptor
        if (await tdRepo.getTestDescriptorById(req.body.newIdTestDescriptor).catch(err => {
            if (err === 404) return err; else throw err;
        }) === 404)
            return res.status(404).send("no test descriptor associated to idTestDescriptor");
        // Get list of SKU Items attached with verified RFID
        let skuItem = await siRepo.getSingleSKUItem(req.params.rfid).catch(err => { throw err });
        if (skuItem.length === 0)
            return res.status(404).send("no sku item associated to rfid");
        // Get the "list" of Test Descriptors with SKU ID
        if (await tdRepo.getTestDescriptorIdsBySKUId(skuItem[0].SKUId).catch(err => {
            if (err === 404) return err; else { throw err }
        }) === 404)
            return res.status(404).send("no test description attached to this SKU Item");
        // Update the Test Descriptors for the SKU
        let sku = await skuRepo.getSkuById(skuItem[0].SKUId).catch(err => { throw err });
        if (sku.length === 0)
            return res.status(404).send("no SKU associated with this SKU Item");
        sku.testDescriptors = req.body.newIdTestDescriptor;
        await skuRepo.editSKU(sku, sku.id);
        return await trRepo.updateTestResult(req.params.id, req.body).then(() => {
            return res.status(200).end();
        }, err => {
            if (err === 404)
                return res.status(404).send("no test result associated to id");
            else { throw err }
        });
    } catch (err) {
        return res.status(503).send("generic error");
    }
}

// DELETE: Delete Test Result
exports.deleteTestResult = async (req, res) => {
    if (!validationResult(req).isEmpty())
        return res.status(422).send("validation of id or of rfid failed");
    try {
        // Check the authenticity of RFID
        if ((await siRepo.getSingleSKUItem(req.params.rfid).catch(err => { throw err })).length === 0)
            return res.status(404).send("no sku item associated to rfid");
        return await trRepo.deleteTestResult(req.params.id).then(() => {
            return res.status(204).end();
        }, err => {
            if (err === 404)
                return res.status(404).send("no test result associated to id");
            else { throw err }
        });
    } catch (err) {
            return res.status(503).send("generic error");
    }
}
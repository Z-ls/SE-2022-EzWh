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
        res.status(422).send("validation of request body or of rfid failed");
    try {
        await siRepo.getSingleSKUItem(req.params.rfid).then(ret => {
            if (ret.length === 0 && !res.headersSent)
                res.status(404).send("no sku item associated to rfid");
        }, err => { throw err });
        await trRepo.getTestResultsByRfid(req.params.rfid).then(rets => {
            res.status(200).json(rets);
        });
    } catch (err) {
        if (!res.headersSent)
            res.status(500).send("generic error");
    }
}

// rfId ==SkuItem==> idSKU ==SKU==> testDescriptors ==TestDescriptor==> idTestDescriptor ==TestResult==> Object.TestResult
exports.getTestResultsByRFID = async(req, res) => {
    if (!validationResult(req).isEmpty())
        res.status(422).send("validation of request body or of rfid failed");
    try {
        let skuItem = await siRepo.getSingleSKUItem(req.params.rfid).then(ret => {
            if (ret.length === 0 && !res.headersSent)
                res.status(404).send("no sku item associated to rfid");
        }, err => { throw err });
        // Searching for Test Descriptors with SKU IDs,
        // using functions defined in Test Descriptor Controller.
        let tdIds = await tdRepo.getTestDescriptorIdsBySKUId(skuItem[0].SKUId).catch(err => {
            if (err === 404 && !res.headersSent)
                res.status(404).send("no test descriptor associated to idTestDescriptor");
        });
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
        res.status(200).json(trj);
    } catch (err) {
        if (!res.headersSent)
            res.status(500).send("generic error");
    }
}

// GET: Test Result By ID
exports.getTestResultById = async (req, res) => {
    // Validation for RFID and Test Result ID.
    if (!validationResult(req).isEmpty())
        res.status(422).send("validation of id or of rfid failed");
    try {
        await siRepo.getSingleSKUItem(req.params.rfid).then(ret => {
            if (ret.length === 0 && !res.headersSent)
                res.status(404).send("no sku item associated to rfid");
        }, err => { throw err });
        await trRepo.getTestResultById(parseInt(req.params.id)).then(ret => {
            res.status(200).json(ret);
        }, err => {
            if (err === 404 && !res.headersSent)
                res.status(404).send("no test result associated to id");
            else { throw err }
        });
    } catch (err) {
        if (!res.headersSent)
            res.status(500).send("generic error");
    }
}

// POST: Add Test Result
exports.addTestResult = async (req, res) => {
    if (!validationResult(req).isEmpty())
        res.status(422).send("validation of request body or of rfid failed");
    try {
        // By default, check the existence of table.
        await trRepo.newTestResultTable();
        // Check the authenticity of RFID
        let skuItem = await siRepo.getSingleSKUItem(req.body.rfid).then(ret => {
            if (ret.length === 0 && !res.headersSent)
                res.status(404).send("no sku item associated to rfid");
            return ret;
        }, err => { throw err });
        // Check the authenticity of idTestDescriptor
        await tdRepo.getTestDescriptorById(req.body.idTestDescriptor).catch(err => {
            if (err === 404 && !res.headersSent)
                res.status(404).send("no test descriptor associated to idTestDescriptor");
            else { throw err }
        });
        // Update the Test Descriptors for the SKU
        let sku = await skuRepo.getSkuById(skuItem[0].SKUId).then(ret => {
            if (ret.length === 0 && !res.headersSent)
                res.status(404).send("no SKU associated with this SKU Item");
            return ret;
        }, err => { throw err });
        sku.testDescriptors = req.body.idTestDescriptor;
        await skuRepo.editSKU(sku, sku.id);
        await trRepo.addTestResult(req.body).then(() => {
            res.status(201).end();
        });
    } catch (err) {
        if (!res.headersSent)
            res.status(503).send("generic error");
    }
}

// PUT: Update Test Result
exports.updateTestResult = async (req, res) => {
    if (!validationResult(req).isEmpty())
        res.status(422).send("validation of request body or of rfid failed");
    try {
        // Check the authenticity of newIdDescriptor
        await tdRepo.getTestDescriptorById(req.body.newIdTestDescriptor).catch(err => {
                if (err === 404 && !res.headersSent)
                    res.status(404).send("no test descriptor associated to newIdTestDescriptor");
            }
        );
        // Get list of SKU Items attached with verified RFID
        let skuItem = await siRepo.getSingleSKUItem(req.params.rfid).then(ret => {
            if (ret.length === 0 && !res.headersSent)
                res.status(404).send("no sku item associated to rfid");
            return ret;
        }, err => { throw err });
        // Get the "list" of Test Descriptors with SKU ID
        await tdRepo.getTestDescriptorIdsBySKUId(skuItem[0].SKUId).catch(err => {
            if (err === 404 && !res.headersSent)
                res.status(404).send("no test description attached to this SKU Item");
            else { throw err }
            }
        );
        // Update the Test Descriptors for the SKU
        let sku = await skuRepo.getSkuById(skuItem[0].SKUId).then(ret => {
            if (ret.length === 0 && !res.headersSent)
                res.status(404).send("no SKU associated with this SKU Item");
            return ret;
        }, err => { throw err });
        sku.testDescriptors = req.body.newIdTestDescriptor;
        await skuRepo.editSKU(sku, sku.id);
        await trRepo.updateTestResult(req.params.id, req.body).then(() => {
            res.status(200).end();
        }, err => {
            if (err === 404 && !res.headersSent)
                res.status(404).send("no test result associated to id");
            else { throw err }
        });
    } catch (err) {
        if (!res.headersSent)
            res.status(503).send("generic error");
    }
}

// DELETE: Delete Test Result
exports.deleteTestResult = async (req, res) => {
    if (!validationResult(req).isEmpty())
        res.status(422).send("validation of id or of rfid failed");
    try {
        // Check the authenticity of RFID
        await siRepo.getSingleSKUItem(req.params.rfid).then(ret => {
            if (ret.length === 0 && !res.headersSent)
                res.status(404).send("no sku item associated to rfid");
        }, err => { throw err });
        await trRepo.deleteTestResult(req.params.id).then(() => {
            res.status(204).end();
        }, err => {
            if (err === 404 && !res.headersSent)
                res.status(404).send("no test result associated to id");
            else { throw err }
        });
    } catch (err) {
        if (!res.headersSent)
            res.status(503).send("generic error");
    }
}
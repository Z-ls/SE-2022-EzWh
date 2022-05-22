const testDescriptorRepository = require('../persistence/testDescriptorRepository');
const skuRepository = require('../persistence/skuRepository');
const { validationResult } = require("express-validator");
const tdRepo = new testDescriptorRepository();
const skuRepo = new skuRepository();

// GET: Test Descriptors
// Test Descriptions as JSON on success
// 500 on generic error
exports.getTestDescriptors = async (req, res) => {
    try {
        await tdRepo.getTestDescriptors().then(ret => {
            res.status(200).json(ret);
        });
    } catch (err) {
        if (!res.headersSent)
            res.status(500).send("generic error");
    }
}

// GET: Test Descriptor By ID
// Test Description as JSON on success
// 422 on IDs failing validations
// 404 on empty result
exports.getTestDescriptorById = async (req, res) => {
    if (!validationResult(req).isEmpty()) 
        res.status(422).send("validation of id failed");
    await tdRepo.getTestDescriptorById(req.params.id).then(ret => {
            res.status(200).json(ret);
            }, err => {
        if (!res.headersSent)
            return err === 404 ?
                res.status(404).send("no test descriptor associated id") :
                res.status(500).send("generic error");
    });
}

// POST: New Test Descriptor
// ID of added descriptor on success
// 422 on failed ID validation
// 404 on non-existent SKU
// 503 on generic error
exports.addTestDescriptor =  async (req, res) => {
    if (!validationResult(req).isEmpty())
        res.status(422).send("validation of request body failed");
    try {
        await skuRepo.getSkuById(req.body.idSKU).then(ret => {
            if (ret.length === 0 && !res.headersSent)
                res.status(404).send("no sku associated idSKU");
        }, err => { throw err });
        await tdRepo.newTestDescriptorTable();
        await tdRepo.addTestDescriptor(req.body).then(() => {
            res.status(201).end();
        });
    } catch (err) {
        if (!res.headersSent)
            res.status(503).send("generic error");
    }
}

// PUT: Update Test Descriptor
// Requested ID on success
// 422 on failed validations
// 404 on non-existent SKU or non-existent descriptor
// 503 on generic error
exports.updateTestDescriptor = async (req, res) => {
    try {
        if (!validationResult(req).isEmpty())
            res.status(422).send("validation of request body or id failed");
        await skuRepo.getSkuById(req.body.newIdSKU).then(ret => {
            if (ret.length === 0 && !res.headersSent)
                res.status(404).send("no sku associated idSKU");
        }, err => { throw err });
        await tdRepo.updateTestDescriptor(req.body, req.params.id)
            .then(() => {
                res.status(200).end();
            }, err => {
                if (err === 404 && !res.headersSent)
                    res.status(404).send("no id associated test descriptor");
                else
                { throw err; }
            });
    } catch (err) {
        if (!res.headersSent)
            res.status(503).send("generic error");
    }
}

// DELETE: Delete Test Descriptor
// Requested ID on success
// 422 on failed validation
// 404 on non-existent descriptor
// 503 on generic error
exports.deleteTestDescriptor = async (req, res) => {
    try {
        if (!validationResult(req).isEmpty())
            res.status(422).send("validation of id failed");
        await tdRepo.deleteTestDescriptor(req.params.id).then(() => {
            res.status(204).end();
        }, err => {
            if (err === 404)
                res.status(404).send("no id associated test descriptor")
            else
            { throw err; }
        });
    } catch (err) {
        if (!res.headersSent)
            res.status(503).send("generic error");
    }
}
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
        return await tdRepo.getTestDescriptors().then(ret => {
            return res.status(200).json(ret);
        });
    } catch (err) {
        return res.status(500).send("generic error");
    }
}

// GET: Test Descriptor By ID
// Test Description as JSON on success
// 422 on IDs failing validations
// 404 on empty result
exports.getTestDescriptorById = async (req, res) => {
    if (!validationResult(req).isEmpty())
        return res.status(422).send("validation of id failed");
    return await tdRepo.getTestDescriptorById(req.params.id).then(ret => {
            return res.status(200).json(ret);
            }, err => {
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
        return res.status(422).send("validation of request body failed");
    try {
        if ((await skuRepo.getSkuById(req.body.idSKU)).length === 0)
            return res.status(404).send("no sku associated idSKU");
        await tdRepo.newTestDescriptorTable();
        return await tdRepo.addTestDescriptor(req.body).then(() => {
            return res.status(201).end();
        });
    } catch (err) {
        if (!res.headersSent)
            return res.status(503).send("generic error");
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
            return res.status(422).send("validation of request body or id failed");
        if ((await skuRepo.getSkuById(req.body.newIdSKU)).length === 0)
                return res.status(404).send("no sku associated idSKU");
        return await tdRepo.updateTestDescriptor(req.body, req.params.id)
            .then(() => {
                return res.status(200).end();
            }, err => {
                if (err === 404)
                    return res.status(404).send("no id associated test descriptor");
                else
                { throw err; }
            });
    } catch (err) {
        return res.status(503).send("generic error");
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
            return res.status(422).send("validation of id failed");
        return await tdRepo.deleteTestDescriptor(req.params.id).then(() => {
            return res.status(204).end();
        }, err => {
            if (err === 404)
                return res.status(404).send("no id associated test descriptor")
            else
            { throw err; }
        });
    } catch (err) {
        return res.status(503).send("generic error");
    }
}

const { possibleStates } = require("../model/internalOrder");
const dateHandler = require("../persistence/dateHandler");
const InternalOrderRepository = require("../persistence/internalOrderRepository");
const { isInt } = require("../persistence/validate");

class InternalOrderController {
  constructor() {
    this.IOrepo = new InternalOrderRepository();
    this.dateHandler = new dateHandler();
  }

  getAll = async (req, res) => {
    try {
      const result = await this.IOrepo.getAll('all');
      return res.status(200).json(result.data);
    }
    catch (e) {
      return res.status(e.code).end();
    }
  }

  getAllIssued = async (req, res) => {
    try {
      const result = await this.IOrepo.getAll('issued');
      return res.status(200).json(result.data);
    }
    catch (e) {
      return res.status(e.code).end();
    }
  }

  getAllAccepted = async (req, res) => {
    try {
      const result = await this.IOrepo.getAll('accepted');
      return res.status(200).json(result.data);
    }
    catch (e) {
      return res.status(e.code).end();
    }
  }

  get = async (req, res) => {
    // validation
    if (!req.params.id || isNaN(parseInt(req.params.id)) || parseInt(req.params.id) < 1)
      return res.status(422).end();

    try {
      const result = await Promise.any(
        [this.IOrepo.get(req.params.id, "other"),
        this.IOrepo.get(req.params.id, "COMPLETED")]
      );
      return res.status(200).json(result);
    }
    catch (e) {
      return res.status(404).end();
    }
  }

  add = async (req, res) => {
    // Validation
    if (
      typeof req.body.issueDate !== 'string' ||
      !this.dateHandler.isDateAndTimeValid(req.body.issueDate) ||
      !isInt(req.body.customerId) ||
      isNaN(parseInt(req.body.customerId)) ||
      !req.body.products ||
      !Array.isArray(req.body.products) ||
      !req.body.products.every(p => isInt(p.SKUId) && typeof p.description === 'string' && typeof p.price === 'number' && isInt(p.qty))
    ) {
      return res.status(422).end();
    }

    try {
      const result = await this.IOrepo.add(req.body);
      return res.status(result.code).end();
    }
    catch (e) {
      return res.status(e.code).end();
    }
  }

  updateState = async (req, res) => {
    // validation
    if (!req.body.newState || !possibleStates.includes(req.body.newState) || !req.params.id || isNaN(parseInt(req.params.id)))
      return res.status(422).end();

    if (req.body.newState === 'COMPLETED') {
      // validation
      console.log("estoy aqui");
      if (!req.body.products || !Array.isArray(req.body.products) || !req.body.products.every(p => isInt(p.SkuID) && typeof p.RFID === 'string')) {
        return res.status(422).end();
      }
      else {
        try {
          await Promise.all([this.IOrepo.addToTransactionRFIDs(req.params.id, req.body.products), this.IOrepo.removeInternalTransactions(req.params.id)]);
          return res.status(200).end();
        }
        catch (e) {
          return res.status(e.code).end();
        }
      }
    }

    try {
      await this.IOrepo.updateState(req.body.newState, req.params.id);
      return res.status(200).end();
    }
    catch (e) {
      return res.status(e.code).end();
    }
  }

  delete = async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id))
      return res.status(422).end();

    try {
      await this.IOrepo.delete(id);
      return res.status(204).end();
    }
    catch (e) {
      return res.status(e.code).end();
    }
  }
}

module.exports = InternalOrderController;
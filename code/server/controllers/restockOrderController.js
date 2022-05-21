const RestockOrder = require("../model/restockOrder");
const dateHandler = require("../persistence/dateHandler");
const restockOrderRepository = require("../persistence/restockOrderRepository");
const { isInt } = require("../persistence/validate");
RORepo = new restockOrderRepository();

class RestockOrderController {
  constructor() {
    this.RORepo = new restockOrderRepository();
    this.dateHandler = new dateHandler();
  }

  getRestockOrder = async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id) || id < 1)
      return res.status(422).end();

    try {
      const result = await this.RORepo.get(id);
      return res.status(result.code).json(result.data);
    }
    catch (e) {
      return res.status(e.code).end();
    }

  }

  getAll = async (_req, res) => {
    try {
      const result = await this.RORepo.getAll();
      return res.status(result.code).json(result.data);
    }
    catch (e) {
      return res.status(e.code).end();
    }
  }

  getAllIssued = async (_req, res) => {
    try {
      const result = await this.RORepo.getAll('ISSUED');
      return res.status(result.code).json(result.data);
    }
    catch (e) {
      return res.status(e.code).end();
    }
  }

  add = async (req, res) => {
    // validation stuff
    if (!req.body)
      return res.status(422).end();
    const ro = req.body;
    if (!this.dateHandler.isDateAndTimeValid(ro.issueDate) ||
      !Array.isArray(ro.products) ||
      !ro.products.every(p => isInt(p.SKUId) && isInt(p.qty) && typeof p.price === 'number' && typeof p.description === 'string') ||
      !isInt(ro.supplierId))
      return res.status(422).end();


    try {
      const result = await this.RORepo.add(ro);
      return res.status(result.code).end();
    }
    catch (e) {
      console.log(e);
      return res.status(e.code).end();
    }
  }

  updateState = async (req, res) => {
    const result = await this.RORepo.updateState(req.params.id, req.body.newState);
    return res.status(result.code).end();
  }

  addSKUItems = async (req, res) => {
    try {
      const result = await this.RORepo.addSKUItems(req.params.id, req.body.skuItems);
      return res.status(result.code).end();
    }
    catch (e) {
      return res.status(e.code).end();
    }
  }

  addTransportNote = async (req, res) => {
    const result = await this.RORepo.addTransportNote(req.params.id, req.body);
    return res.status(result.code).end();
  }

  delete = async (req, res) => {
    // validation
    const id = parseInt(req.params.id);
    if (!isInt(id))
      return res.status(422).end();

    try {
      const result = await this.RORepo.remove(id);
      return res.status(result.code).end();
    }
    catch (e) {
      return res.status(e.code).end();
    }
  }

  returnItems = async (req, res) => {
    // validation
    const id = parseInt(req.params.id);
    if (!isInt(id))
      return res.status(422).end();

    try {
      const result = await this.RORepo.returnItems(id);
      return res.status(result.code).json(result.data);
    }
    catch (e) {
      return res.status(e.code).end();
    }

  }
}



module.exports = RestockOrderController;

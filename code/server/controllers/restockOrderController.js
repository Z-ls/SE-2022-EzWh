const dateHandler = require("../persistence/dateHandler");
const restockOrderRepository = require("../persistence/restockOrderRepository");
const { isInt } = require("../persistence/validate");
RORepo = new restockOrderRepository();

class RestockOrderController {
  constructor() {
    this.RORepo = new restockOrderRepository();
    this.dateHandler = new dateHandler();
  }

  getRestockOrder = async (id) => {
    try {
      const result = await this.RORepo.get(id);
      return result;
    }
    catch (e) {
      return e;
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

  add = async (ro) => {
    try {
      return await this.RORepo.add(ro);

    }
    catch (e) {
      return e;
    }
  }

  updateState = async (id, newState) => {
    try {
      return await this.RORepo.updateState(id, newState);
    }
    catch (e) {
      return e;
    }
  }

  addSKUItems = async (id, skuItems) => {
    try {
      return await this.RORepo.addSKUItems(id, skuItems);
    }
    catch (e) {
      return e;
    }
  }

  addTransportNote = async (id, deliveryDate) => {
    try {
      return await this.RORepo.addTransportNote(id, deliveryDate);
    } catch (e) {
      return e;
    }

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

  returnItems = async (id) => {
    try {
      return await this.RORepo.returnItems(id);
    }
    catch (e) {
      return e;
    }
  }
}



module.exports = RestockOrderController;

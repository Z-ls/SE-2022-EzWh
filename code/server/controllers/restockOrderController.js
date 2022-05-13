const RestockOrder = require("../model/restockOrder");
const restockOrderRepository = require("../persistence/restockOrderRepository");
RORepo = new restockOrderRepository();

class RestockOrderController {
  constructor() {
    this.RORepo = new restockOrderRepository();
  }

  getRestockOrder = async (req, res) => {
    try {
      const result = await this.RORepo.get(req.params.id);
      return res.status(result.code).json(result.data);
    }
    catch (e) {
      return res.status(e.code).end();
    }

  }

  getAll = async (_req, res) => {
    const result = await this.RORepo.getAll();
    return res.status(result.code).json(result.data);
  }

  getAllIssued = async (_req, res) => {
    const result = await this.RORepo.getAll('ISSUED');
    return res.status(result.code).json(result.data);
  }

  add = async (req, res) => {
    const result = await this.RORepo.add(
      {
        issueDate: req.body.issueDate,
        products: req.body.products,
        supplierId: req.body.supplierId
      }
    );
    return res.status(result.code).json(result.data);
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
    const result = await this.RORepo.remove(req.params.id);
    return res.status(result.code).end();
  }

  returnItems = async (req, res) => {

    try {
      const result = await this.RORepo.returnItems(req.params.id);
      return res.status(result.code).json(result.data);
    }
    catch (e) {
      const result = e;
      return res.status(result.code).end();
    }

  }
}



module.exports = RestockOrderController;


const dayjs = require("dayjs");
const { possibleStates } = require("../model/internalOrder");
const dateHandler = require("../persistence/dateHandler");
const InternalOrderRepository = require("../persistence/internalOrderRepository");
const skuItemRepository = require("../persistence/skuItemRepository");
const { isInt } = require("../persistence/validate");

class InternalOrderController {
  constructor() {
    this.IOrepo = new InternalOrderRepository();
    this.dateHandler = new dateHandler();
    this.skuItemRepo = new skuItemRepository();
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

  get = async (id) => {
    try {
      const result = await Promise.any(
        [this.IOrepo.get(id, "other"),
        this.IOrepo.get(id, "COMPLETED")]
      );
      return result;
    }
    catch (e) {
      if (e instanceof AggregateError)
        return { code: 404 };
      return e;
    }
  }

  add = async (io) => {
    try {
      return await this.IOrepo.add(io);
    }
    catch (e) {
      return e;
    }
  }

  updateState = async (id, body) => {

    try {
      await await Promise.any([this.IOrepo.get(id, "other"), this.IOrepo.get(id, "COMPLETED")]);
    }
    catch (e) {
      return ({ code: 404 });
    }

    if (body.newState === 'COMPLETED') {
      try {
        //await Promise.all(body.products.map((p) => { return this.skuItemRepo.addSKUItem({ RFID: p.RFID, SKUId: p.SkuID, DateOfStock: this.dateHandler.DayjsToDateAndTime(dayjs()) }) }));
        body.products.forEach(async (p) => {
          await this.skuItemRepo.addSKUItem({ RFID: p.RFID, SKUId: p.SkuID, DateOfStock: this.dateHandler.DayjsToDateAndTime(dayjs()) });
        });
        await Promise.all([this.IOrepo.addToTransactionRFIDs(id, body.products), this.IOrepo.removeInternalTransactions(id)]);
        //await this.IOrepo.addToTransactionRFIDs(id, body.products)
        //await this.IOrepo.removeInternalTransactions(id);
      }
      catch (e) {
        return e;
      }
    }

    try {
      await this.IOrepo.updateState(body.newState, id);
      return { code: 200 };
    }
    catch (e) {
      return e;
    }
  }

  delete = async (id) => {

    try {
      await this.IOrepo.delete(id);
      const allInternarOrders = await this.IOrepo.getAll('all');
      if (allInternarOrders.data.length === 0)
        await this.IOrepo.deleteSequence();
      return { code: 204 };
    }
    catch (e) {
      return e;
    }
  }
}

module.exports = InternalOrderController;
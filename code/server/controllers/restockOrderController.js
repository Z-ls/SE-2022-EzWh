const RestockOrder = require("../model/restockOrder");
const restockOrderRepository = require("../persistence/restockOrderRepository");
RORepo = new restockOrderRepository();

const getRestockOrder = async (req, res) => {
  const result = await RORepo.getRO(req.params.id);
  return res.status(result.code).json(result.data);
}


module.exports = { getRestockOrder };

const RET = require("../model/returnOrder");
const retRepository = require("../persistence/returnOrderRepository");

const getReturnOrders = async(req, res) => {
    const retRep = new retRepository();
   /* await retRep.dropTable();
    await retRep.newTableRETURN();
    await retRep.addReturnOrder(new RET("2021/11/29 09:33", "1")); */
    const retlist = await retRep.getReturnOrders();
    let message = retlist
    return res.status(200).json(message);
}

const getReturnOrdersByID = async(req, res) => {
    const retRep = new retRepository();
    const retlist = await retRep.getReturnOrderbyID(req.params.id);
    if(retlist.lenght !== 0){
    let message = retlist
    return res.status(200).json(message);}
    return res.status(404).send('Not found');
}

const addReturnOrder = async (req, res) => {
    const retRep = new retRepository();
    const created = await retRep.addReturnOrder(req.params.id, r.params.returnDate, r.params.restockOrderID);
    return created ? res.status(201).send('Created') : res.status(422).send('Unprocessable Entity');
}

const deleteReturnOrder = async (req, res) => {
    const retRep = new retRepository();
    const deleted = await retRep.deleteReturnOrder(req.params.id);
    return deleted ? res.status(204).send('Deleted') : res.status(422).send('Unprocessable Entity');
}

module.exports = {
    getReturnOrders,
    getReturnOrdersByID,
    addReturnOrder,
    deleteReturnOrder
};
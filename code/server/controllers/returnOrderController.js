const RET = require("../model/returnOrder");
const retRepository = require("../persistence/returnOrderRepository");

const getReturnOrders = async() => {
    const retRep = new retRepository();
   /* await retRep.dropTable();
    await retRep.newTableRETURN();
    await retRep.addReturnOrder(new RET("2021/11/29 09:33", "1")); */
    const retlist = await retRep.getReturnOrders();
    for (let i = 0; i < retlist.length; i++) {
        let RetOrd = retlist[i];
         RetOrd.products= await retRep.getProductsbyID(RetOrd.returnOrderID);
    }
    return retlist;//res.status(200).json(message);
}

const getReturnOrdersByID = async(id) => {
    const retRep = new retRepository();
    const RetOrd = await retRep.getReturnOrderbyID(id);
    RetOrd[0].products= await retRep.getProductsbyID(RetOrd[0].returnOrderID);
    console.log(RetOrd);
    return RetOrd;
}

const addReturnOrder = async (newRet) => {
    const retRep = new retRepository();
    const lastID = await retRep.addReturnOrder(newRet.returnDate, newRet.restockOrderId);
    const created = await retRep.addReturnOrderTransaction(lastID, newRet.products);
    return created;// ? res.status(201).send('Created') : res.status(422).send('Unprocessable Entity');
}

const deleteReturnOrder = async (id) => {
    const retRep = new retRepository();
    const deleted = await retRep.deleteReturnOrder(id);
    return deleted;// ? res.status(204).send('Deleted') : res.status(422).send('Unprocessable Entity');
}

module.exports = {
    getReturnOrders,
    getReturnOrdersByID,
    addReturnOrder,
    deleteReturnOrder
};
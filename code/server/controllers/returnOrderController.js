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
         RetOrd.products= await testDesRep.getProductsbyID(RetOrd.id);
    }
    return retlist;//res.status(200).json(message);
}

const getReturnOrdersByID = async(id) => {
    const retRep = new retRepository();
    const res = await retRep.getReturnOrderbyID(id);
    res.products= await testDesRep.getProductsbyID(res.id)
    return res;
    //res.status(200).json(message);}
    //res.status(404).send('Not found');
}

const addReturnOrder = async (newRet) => {
    console.log(newRet.returnDate);
    console.log(newRet.products);
    console.log(newRet.restockOrderID);
    const retRep = new retRepository();
    const created = await retRep.addReturnOrder(newRet.returnDate, newRet.products, newRet.restockOrderID);
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
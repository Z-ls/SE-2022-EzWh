const returnOrderRepository = require('../persistence/returnOrderRepository');

const getReturnOrders = async(req,res) =>{
    const returnRep = new returnOrderRepository();
}

module.exports = {
    getReturnOrders
}
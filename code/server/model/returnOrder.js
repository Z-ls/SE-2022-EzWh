const dateHandler = require('../persistence/dateHandler');

function ReturnOrder(returnOrderID, returnDate, products, restockOrderId){
    this.returnOrderID = returnOrderID;
    this.returnDate = returnDate;
    this.products = products;
    this.restockOrderId = restockOrderId;
}

module.exports = ReturnOrder;
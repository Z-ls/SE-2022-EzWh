const dateHandler = require('../persistence/dateHandler');

function ReturnOrder(returnOrderID, returnDate, products, restockOrderID){
    this.returnOrderID = returnOrderID;
    this.returnDate = returnDate;
    this.products = products;
    this.restockOrderID = restockOrderID;
}

module.exports = ReturnOrder;
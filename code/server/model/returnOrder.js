const dayjs = require('dayjs');
const dateHandler = require('../persistence/dateHandler');

function ReturnOrder(returnOrderID, returnDate, products, restockOrderID, state){
    this.returnOrderID = returnOrderID;
    this.returnDate = new dateHandler().DayjsToDateAndTime(returnDate);
    this.products = products;
    this.restockOrderID = restockOrderID;
    this.state = state;
}

module.exports = ReturnOrder;
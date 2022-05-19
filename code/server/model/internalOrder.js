const dayjs = require('dayjs');
const dateHandler = require('../persistence/dateHandler');

class InternalOrder {
  /**
   * 
   * @param {number} id 
   * @param {dayjs} issueDate with format YYYY/MM/DD HH:mm
   * @param {string} state 
   * @param {{SKUid:number, description:string, price:number, qty:number}[]} products 
   * @param {number} customerId 
   */
  constructor(id, issueDate, state, products, customerId) {
    this.id = id;
    this.issueDate = issueDate;
    this.state = state;
    this.products = products;
    this.customerId = customerId;

    this.dateHandler = new dateHandler();
  }

  toString = () => {
    return {
      id: this.id,
      issueDate: this.dateHandler.DayjsToDateAndTime(this.issueDate),
      state: this.state,
      products: this.products,
      customerId: this.customerId,
    }
  };
}

const possibleStates = ["ISSUED", "ACCEPTED", "REFUSED", "CANCELED", "COMPLETED"];

module.exports = { InternalOrder, possibleStates };
const dayjs = require('dayjs');
const dateHandler = require('../persistence/dateHandler');

class RestockOrder {
  /**
   * 
   * @param {number} id 
   * @param {dayjs} issueDate 
   * @param {string} state 
   * @param {{SKUid:number, description:string, price:number, qty:number}[]} products 
   * @param {number} supplierId 
   * @param {{deliveryDate:string}[]} transportNote 
   * @param {{SKUId:number, rfid:string}[]} skuItems 
   */
  constructor(id, issueDate, state, products, supplierId, transportNote, skuItems) {
    this.id = id;
    this.issueDate = issueDate;
    this.state = state;
    this.products = products;
    this.supplierId = supplierId;
    this.transportNote = transportNote;
    this.skuItems = skuItems;

    this.dateHandler = new dateHandler();
  }

  toString = () => {
    return {
      id: this.id,
      issueDate: this.dateHandler.DayjsToDateAndTime(this.issueDate),
      state: this.state,
      products: this.products,
      supplierId: this.supplierId,
      transportNote: this.transportNote.deliveryDate ? { deliveryDate: this.dateHandler.DayjsToDate(this.transportNote.deliveryDate) } : {},
      skuItems: this.skuItems
    }
  };
}

const possibleStates = ["ISSUED", "DELIVERY", "DELIVERED", "TESTED", "RETURN", "COMPLETED"];

module.exports = { RestockOrder, possibleStates };
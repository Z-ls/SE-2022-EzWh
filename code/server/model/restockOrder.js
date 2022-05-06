const dayjs = require('dayjs');
const dateHandler = require('../persistence/dateHandler');

// TODO: verify that 'Product' really exists

class RestockOrder {
  /**
   * 
   * @param {number} id 
   * @param {dayjs} issueDate 
   * @param {string} state 
   * @param {Product[]} products 
   * @param {number} supplierId 
   * @param {transportNote[]} transportNote 
   * @param {SKUItems[]} skuItems 
   */
  constructor(id, issueDate, state, products, supplierId, transportNote, skuItems) {
    this.id = id;
    this.issueDate = issueDate;
    this.state = state;
    this.products = products;
    this.supplierId = supplierId;
    this.transportNote = transportNote;
    this.skuItems = skuItems;
  }

  toString = () => {
    return {
      id: this.id,
      issueDate: new dateHandler().DayjsToDateAndTime(this.issueDate),
      state: this.state,
      products: this.products,
      supplierId: this.supplierId,
      transportNote: this.transportNote,
      skuItems: this.skuItems
    }
  };
}

module.exports = RestockOrder
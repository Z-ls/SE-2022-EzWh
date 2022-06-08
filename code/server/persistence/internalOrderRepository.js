const sqlite = require('sqlite3');
const { InternalOrder, possibleStates } = require('../model/internalOrder');
const dayjs = require('dayjs');
const dateHandler = require('./dateHandler');

class InternalOrderRepository {
  constructor() {
    this.db = new sqlite.Database('../ezwh.db', (err) => {
      if (err) {
        throw err;
      }
    });
    this.db.run("PRAGMA foreign_keys = ON"); // necessary to make sql lite to comply with the foreign key constraints
    this.dateHandler = new dateHandler();
  }

  /** Returns a single internal order, based on its id and state
   * 
   * @param {number} id 
   * @param {string} state 
   * @returns {Promise}
   */
  get(id, state) {
    return new Promise((resolve, reject) => {
      const completedOrderQuery = "SELECT io.idInternalOrder as id, io.issueDate as issueDate, io.state as state, SKUITEM.SKUId as SKUId, SKU.description as description, SKU.price as price, itr.RFID as RFID, io.customerId as customerId  FROM internalOrder io, internalOrderTransactionRFID itr, SKUITEM, SKU WHERE io.idInternalOrder=itr.IOid and itr.RFID=SKUITEM.RFID and SKU.id=SKUITEM.SKUId and itr.IOid=?";
      const notCompletedOrderQuery = "SELECT io.idInternalOrder as id, io.issueDate as issueDate, io.state as state, SKU.id as SKUId, SKU.description as description, SKU.price as price, it.qty as qty, io.customerId as customerId FROM internalOrder io, internalTransaction it, SKU WHERE io.idInternalOrder=it.idInternalOrder and it.idSKU=SKU.id and io.idInternalOrder=?";
      this.db.all((state === 'COMPLETED' ? completedOrderQuery : notCompletedOrderQuery), id,
        (err, rows) => {
          if (err)
            reject(false);
          else {
            let initialValue;
            try {
              initialValue = new InternalOrder(rows[0].id, dayjs(rows[0].issueDate), rows[0].state, [], rows[0].customerId);
            } catch (e) {
              reject({ code: 404, data: "Internal order not found" });
              return;
            }
            let internalOrder;
            if (state === 'COMPLETED') {
              internalOrder = rows.reduce((acc, curr) => {
                acc.products.push({ SKUId: curr.SKUId, description: curr.description, price: curr.price, RFID: curr.RFID });
                return acc;
              }, initialValue);
            }
            else {
              internalOrder = rows.reduce((acc, curr) => {
                acc.products.push({ SKUId: curr.SKUId, description: curr.description, price: curr.price, qty: curr.qty });
                return acc;
              }, initialValue)
            }
            resolve(internalOrder.toString());
          }
        }
      );
    });
  }

  /**
   * 
   * @param {string} filter could be "all", "issued" or "accepted"  
   * @returns 
   */
  getAll(filter) {
    return new Promise((resolve, reject) => {
      const whereCondition = "WHERE state='" + filter.toUpperCase() + "'";
      const query = "SELECT internalOrder.idInternalOrder as id, internalOrder.state as state from internalOrder " + (filter === 'all' ? '' : whereCondition);
      this.db.all(query,
        async (err, rows) => {
          if (err) {
            reject({ code: 500 });
          }
          else {
            try {
              const internalOrders = await Promise.all(rows.map(row => { return this.get(row.id, row.state) }));
              resolve({ code: 200, data: internalOrders });
            }
            catch (e) {
              reject({ code: 500 });
            }
          }
        });
    })
  }

  // Used to add products to internal transaction table
  addToInternalTransaction(id, products) {
    return new Promise((resolve, reject) => {
      const query = ("INSERT INTO internalTransaction (idInternalOrder, idSKU, qty) values " + "(?,?,?),".repeat(products.length)).slice(0, -1);
      this.db.run(
        query,
        products.flatMap(p => [id, p.SKUId, p.qty]),
        (err) => {
          if (err) {
            return reject({ addToInternalTransaction: true, code: 503, data: err });
          }
          else
            return resolve({ code: 200 });
        }
      );
    })
  }

  // Adds the internal order inside internalOrder
  addToInternalOrder(internalOrder) {
    return new Promise((resolve, reject) => {
      const query = "INSERT INTO internalOrder (issueDate,customerId,state) values (?,?,'ISSUED')";
      this.db.run(query, [internalOrder.issueDate, internalOrder.customerId],
        function (err) {
          if (err) {
            return reject({ code: 503, data: err });
          }
          else {
            if (this.lastID) {
              resolve(this.lastID);
            }
            else {
              reject({ code: 503, data: "error while adding to internalOrder" });
            }
          }
        })
    });
  }
  add(internalOrder) {
    return new Promise(async (resolve, reject) => {
      let id;
      try {
        id = await this.addToInternalOrder(internalOrder);
        await this.addToInternalTransaction(id, internalOrder.products);
        resolve({ code: 201 });
      }
      catch (e) {
        if (e.addToInternalTransaction) {
          console.log("pippo qui");
          this.db.run("DELETE FROM internalOrder WHERE idInternalOrder=?", id, (_err) => { reject({ code: e.code }); });
        }
      }
    });
  }

  /**
   * Implementation for PUT /api/internalOrders/:id
   * @param {string} state 
   * @param {number} id 
   * @returns 
   */
  updateState(state, id) {
    return new Promise((resolve, reject) => {
      const query = "UPDATE internalOrder SET state=? WHERE idInternalOrder=?";
      this.db.run(query, [state, id],
        function (err) {
          if (err) {
            reject({ code: 503 });
          }
          else {
            if (this.changes === 0) {
              reject({ code: 404 });
            }
            else
              resolve(true);
          }
        })
    });
  }

  // used in updateState
  addToTransactionRFIDs(id, products) {
    return new Promise(async (resolve, reject) => {
      const query = ("INSERT INTO internalOrderTransactionRFID (IOid, RFID) values " + "(?,?),".repeat(products.length)).slice(0, -1);
      this.db.run(query, products.flatMap(p => [id, p.RFID]),
        (err) => {
          if (err) {
            console.log(JSON.stringify(products));
            reject({ code: 503, data: "error while adding to internalOrderTransactionRFID. " + err });
          }
          else resolve(true);
        })
    });
  }

  // used in updateState
  // deletes all the transaction related to an order
  removeInternalTransactions(id) {
    return new Promise((resolve, reject) => {
      const query = "DELETE FROM internalTransaction WHERE idInternalOrder=?";
      this.db.run(query, id,
        function (err) {
          if (err)
            reject({ code: 503, data: "error while deleting from internalTransaction" });
          else
            resolve(true);
        })
    });
  }

  /**
   * Implementation for DELETE /api/internalOrders/:id
   * @param {number} id 
   * @returns 
   */
  delete(id) {
    return new Promise((resolve, reject) => {
      const query = "DELETE FROM internalOrder WHERE idInternalOrder=?";
      this.db.run(
        query,
        id, function (err) {
          if (err)
            reject({ code: 503 });
          else {
            if (this.changes === 0)
              reject({ code: 422 });
            else
              resolve(true);
          }
        }
      );
    });
  }

  deleteSequence = () => {
    return new Promise((resolve, reject) => {
      const sql = ' DELETE FROM sqlite_sequence WHERE name = ? ;';
      this.db.run(sql, "internalOrder", (err) => {
        if (err) {
          reject(err);
        }
        resolve(true);
      });
    });
  }

  deleteInternalOrderdata() {
    return new Promise((resolve, reject) => {
      this.db.run('DELETE FROM sqlite_sequence;');
      const sql = 'DELETE FROM internalOrder;';
      this.db.run(sql, (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(true);
      });
    });
  }
}

module.exports = InternalOrderRepository;
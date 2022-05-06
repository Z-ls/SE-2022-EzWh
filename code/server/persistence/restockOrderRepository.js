const sqlite = require('sqlite3');
const RestockOrder = require('../model/restockOrder');
const dayjs = require('dayjs');
const dateHandler = require('./dateHandler');


class restockOrderRepository {
  constructor() {
    this.db = new sqlite.Database('../ezwh.db', (err) => {
      if (err) {
        throw err;
      }
    });
    this.dateHandler = new dateHandler();
  }

  /**
   * 
   * @returns true in case of successfully deletion, otherwise the error. 
   */
  dropTable() {
    return new Promise((resolve, reject) => {
      const sql = 'DROP TABLE IF EXISTS restockOrder';
      this.db.run(sql, (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(true);
      });
    });
  }
  /**
   * 
   * @returns {Promise} true in case of successfully creation, otherwise the error. 
   */
  newTable() {
    return new Promise((resolve, reject) => {
      const query = 'CREATE TABLE IF NOT EXISTS restockOrder(id	INTEGER, issueDate INTEGER NOT NULL, state	TEXT NOT NULL, supplierId	INTEGER NOT NULL, PRIMARY KEY("id" AUTOINCREMENT))';
      this.db.run(query, (err) => {
        err ? reject(err) : resolve(true);
      });
    });
  }

  /**
   * 
   * @returns {Promise<RestockOrder[]>} the array of the restock order without skuItems and products populated.
   */
  getAllPlain() {
    return new Promise((resolve, reject) => {
      const ROs = [];
      let query = "SELECT restockOrder.id as id, issueDate, restockOrder.state as state, supplierId, t.note as transportNote FROM restockOrder LEFT JOIN transportNote ON restockOrder.id=transportNote.ROid";
      this.db.each(
        query,
        (err, row) => {
          if (err)
            reject(err);
          else
            ROs.push(new RestockOrder(row.id, dayjs(row.issueDate), row.state, [], row.supplierId, transportNote, []));
        },
        () => { resolve(ROs) }
      )
    });
  }

  /**
   * It first create all the ROs then, takes each row and properly pushes the sku and item information in products and skuItems.
   * @returns {Promise} the array in case of success, otherwise the error.
   */
  async getAll() {
    return new Promise((resolve, reject) => {
      this.getAllPlain().then(ROs => {
        query = "SELECT r.id as id, s.SKUId as SKUId, s.RFID as rfid,issueDate, r.state as state, sku.description as description, supplierId, t.note as transportNote " +
          "FROM restockOrder r, transportNote t, restockTransactionItem rti, restockTransactionSKU rts, SKUItem s, SKU " +
          "WHERE r.id = t.ROid and r.id = rts.idRestockOrder and r.id = rti.idRestockOrder and r.id = rts.idRestockOrder and s.RFID = rts.RFID and sku.id=s.SKUId";
        this.db.each(
          query,
          (err, row) => {
            if (err)
              reject(err);
            else {
              const index = ROs.findIndex(ro => ro.id == row.id);
              ROs[index].products.push({ SKUId: row.SKUId, description: row.description, price: row.price });
              ROs[index].skuItems.push({ SKUId: row.SKUId, rfid: row.rfid });
            }
          },
          () => { resolve(ROs) }
        );
      });


    });
  }


  /**
  * Same as {@link getAll} but with the state = 'issued'.
  * @returns {Promise<RestockOrder[]>} the array in case of success, otherwise the error.
  */
  getAllIssued() {
    return new Promise((resolve, reject) => {
      this.getAllPlain()
        .then((ROs) => {
          query = "SELECT r.id as id, s.SKUId as SKUId, s.RFID as rfid,issueDate, r.state as state, sku.description as description, supplierId, t.note as transportNote " +
            "FROM restockOrder r, transportNote t, restockTransactionItem rti, restockTransactionSKU rts, SKUItem s, SKU " +
            "WHERE r.id = t.ROid and r.id = rts.idRestockOrder and r.id = rti.idRestockOrder and r.id = rts.idRestockOrder and s.RFID = rts.RFID and sku.id=s.SKUId and r.state='issued'";
          this.db.each(
            query,
            (err, row) => {
              if (err)
                reject(err);
              else {
                const index = ROs.findIndex(ro => ro.id == row.id);
                ROs[index].products.push({ SKUId: row.SKUId, description: row.description, price: row.price });
                ROs[index].skuItems.push({ SKUId: row.SKUId, rfid: row.rfid });
              }
            },
            () => { resolve(ROs) }
          );
        });
    });
  };

  getRO = async (id) => {
    return new Promise((resolve) => {
      const query = "SELECT restockOrder.id as id, SKUITEM.SKUId as SKUId, SKUITEM.RFID as rfid,issueDate, restockOrder.state as state, sku.description as description, supplierId, transportNote.note as transportNote " +
        "FROM restockOrder LEFT JOIN transportNote ON restockOrder.id=transportNote.ROid " +
        "LEFT JOIN restockTransactionItem on restockOrder.id = restockTransactionItem.idRestockOrder " +
        "LEFT JOIN restockTransactionSKU ON restockOrder.id = restockTransactionSKU.idRestockOrder " +
        "LEFT JOIN SKUITEM ON restockTransactionSKU.RFID = SKUITEM.RFID LEFT JOIN SKU on SKUITEM.SKUId = SKU.id WHERE restockOrder.id=?";
      this.db.all(
        query,
        [id],
        (err, rows) => {
          if (err)
            resolve({ code: 500, data: { error: err } });
          else {
            const RO = new RestockOrder(rows[0].id, dayjs(rows[0].issueDate), rows[0].state, [], rows[0].supplierId, rows[0].transportNote, [])
            rows.map(row => {
              if (row.SKUId !== null) {
                RO.products.push({ SKUId: row.SKUId, description: row.description, price: row.price });
                RO.skuItems.push({ SKUId: row.SKUId, rfid: row.rfid });
              }
            });
            resolve({ code: 200, data: RO.toString() });
          }
        })
    })
  }

}

module.exports = restockOrderRepository;

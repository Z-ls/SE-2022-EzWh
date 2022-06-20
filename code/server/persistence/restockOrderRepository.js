const sqlite = require('sqlite3');
const { RestockOrder, possibleStates } = require('../model/restockOrder');
const dayjs = require('dayjs');
const dateHandler = require('./dateHandler');
const itemRepository = require('./itemRepository');
const skuItemRepository = require('./skuItemRepository');
const { isInt } = require('./validate');

// TODO : validate json structure for each API.

class restockOrderRepository {
  constructor() {
    this.db = new sqlite.Database('../ezwh.db', (err) => {
      if (err) {
        throw err;
      }
    });
    this.db.run("PRAGMA foreign_keys = ON"); // necessary to make sql lite to comply with the foreign key constraints
    this.dateHandler = new dateHandler();
    this.itemRepo = new itemRepository();
    this.skuitemRepository = new skuItemRepository();
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
   * It returns all the items (and the related information) associated to a restock order
   * @param {number} id of the restock order
   * @returns {Promise} 
   */
  getOrderItems(id, supplierId) {
    return new Promise((resolve, reject) => {
      const query = "SELECT SKUId, item.id as itemId, quantity, item.description as description, item.price as price FROM restockTransactionItem JOIN item on restockTransactionItem.idItem=item.id WHERE idRestockOrder=? AND restockTransactionItem.supplierId=?";
      this.db.all(query, [id, supplierId],
        (err, rows) => {
          if (err)
            reject(err);
          else
            resolve(
              rows.map(row => ({ SKUId: row.SKUId, itemId: row.itemId, description: row.description, price: row.price, qty: row.quantity }))
            );
        })
    })
  }

  /**
   * It returns all the SKUItems (and the related information) associated to a restock order.
   * @param {number} id 
   * @returns {Promise}
   */
  getOrderRFIDs(id, supplierId) {
    return new Promise((resolve) => {
      const query = "SELECT SKUITEM.SKUId, item.id as itemId, SKUITEM.RFID FROM restockTransactionSKU join SKUITEM on restockTransactionSKU.RFID=SKUITEM.RFID join item on item.SKUId=SKUItem.SKUId WHERE restockTransactionSKU.idRestockOrder=? AND item.supplierId=?";
      this.db.all(query, [id, supplierId],
        (_err, rows) => {
          resolve(
            rows.map(row => ({ SKUId: row.SKUId, rfid: row.RFID }))
          )
        }
      )
    });
  }


  /**
   * 
   * It first creates all the ROs then, takes each row and properly populates products and skuItems.
   * @param state {} the state to filter the restock orders with. Without passing it it takes them all.
   * @returns {Promise} the array in case of success, otherwise the error.
   */
  async getAll(state = false) {
    return new Promise((resolve) => {
      let ROs = [];
      const query = "SELECT restockOrder.id as id, issueDate, restockOrder.state as state, supplierId, transportNote.deliveryDate as deliveryDate " +
        "FROM restockOrder LEFT JOIN transportNote ON restockOrder.id=transportNote.ROid " + (state === false ? '' : ' WHERE restockOrder.state=\'' + state + "'");
      this.db.each(
        query,
        (err, row) => {
          if (err)
            reject({ code: 500, data: { error: err } });
          else {
            ROs.push(new RestockOrder(row.id, dayjs(row.issueDate), row.state, [], row.supplierId, row.deliveryDate && row.state != 'ISSUED' ? { deliveryDate: dayjs(row.deliveryDate) } : {}, []));
          }
        },
        async () => {
          ROs = await Promise.all(ROs.map(async (ro) => {
            let orderItems, orderRFIDs;
            try {
              [orderItems, orderRFIDs] = await Promise.all([this.getOrderItems(ro.id, ro.supplierId), this.getOrderRFIDs(ro.id, ro.supplierId)]);
            } catch (error) {
              resolve({ code: 500, data: error });
              return;
            }
            ro.products = orderItems;
            ro.skuItems = orderRFIDs;
            return ro;
          }));
          resolve({ code: 200, data: ROs.map(ro => ro.toString()) });
        }
      );
    });
  }

  /**
   * It gets a restock order.
   * @param {number} id the restock order ID.
   * @returns {Promise}
   */
  async get(id) {
    return new Promise((resolve, reject) => {
      const query = "SELECT restockOrder.id as id, issueDate, restockOrder.state as state, supplierId, transportNote.deliveryDate as deliveryDate " +
        "FROM restockOrder LEFT JOIN transportNote ON restockOrder.id=transportNote.ROid WHERE restockOrder.id=?";
      this.db.get(
        query,
        [id],
        async (err, row) => {
          if (err)
            reject({ code: 500 });
          else {
            if (row === undefined) {
              reject({ code: 404 });
              return;
            }
            const RO = new RestockOrder(row.id, dayjs(row.issueDate), row.state, [], row.supplierId, row.deliveryDate ? { deliveryDate: dayjs(row.deliveryDate) } : {}, []);
            let orderItems, orderRFIDs;
            try {
              [orderItems, orderRFIDs] = await Promise.all([this.getOrderItems(RO.id), this.getOrderRFIDs(RO.id)]);
            } catch (error) {
              reject({ code: 500, data: error });
              return;
            }
            RO.products = orderItems;
            RO.skuItems = orderRFIDs;
            resolve({ code: 200, data: RO.toString() });
          }
        })
    })
  }

  /**
   * 
   * @param  ro the restock order object to insert in the db. It only has issueDate, products and supplierId as parameters.
   * @returns {Promise} 
   */
  async add(ro) {
    const addRO = () => {
      return new Promise((resolve, reject) => {
        const query = "INSERT INTO restockOrder (issueDate,state,supplierId) values (?,'ISSUED',?)";
        this.db.run(query, [ro.issueDate, ro.supplierId], function (err) {
          if (err)
            reject(err);
          else {
            resolve(this.lastID);
          }
        });
      });
    }

    function addProduct(idRO, skuid, quantity, itemRepo, db, itemId) {
      return new Promise(async (resolve, reject) => {
        let item;
        try {
          item = await itemRepo.getItemsBySupplierAndSKUId({ supplierId: ro.supplierId, SKUId: skuid, id: itemId });
          if (item.length === 0) {
            reject('Item not found in addProduct');
            return;
          }
        }
        catch (error) {
          reject('Error while getting item in addProduct: ' + error);
          return;
        }
        const query = "INSERT INTO restockTransactionItem (idRestockOrder, quantity, idItem, supplierId) VALUES(?,?,?,?)";
        db.run(query, [idRO, quantity, item[0].id, item[0].supplierId], (err) => {
          if (err)
            reject(err);
          else
            resolve(true);
        });
      })
    }


    return new Promise(async (resolve, reject) => {
      let roID
      try { roID = await addRO(); }
      catch (e) {
        reject({ code: 422 });
        return;
      }
      await Promise.all(ro.products.map(p => addProduct(roID, p.SKUId, p.qty, this.itemRepo, this.db, p.itemId)))
        .then(() => resolve({ code: 201, data: "Restock order successfully created" }))
        .catch((e) => {
          reject({ code: 422, data: "Generic error: " + e })
        }
        );
    })
  }

  /**
   * It deletes a restock order.
   * @param {number} id 
   * @returns {Promise}
   */
  remove(id) {
    return new Promise((resolve, reject) => {
      // VALIDATION

      const query = "DELETE FROM restockOrder WHERE id=?";
      this.db.run(
        query,
        parseInt(id), function (err) {
          if (err)
            reject({ code: 503 });
          else {
            if (this.changes === 0)
              reject({ code: 422 });
            else
              resolve({ code: 204 });
          }
        }
      );
    });
  }

  /**
   * Updates the state of the restock order
   * @param {number} id of the restock order
   * @param {string} newState the new state
   */
  updateState(id, newState) {
    return new Promise((resolve) => {
      if (!newState || !possibleStates.some(s => s === newState)) {
        resolve({ code: 422 });
        return;
      }
      if (isNaN(parseInt(id))) {
        resolve({ code: 422 });
        return;
      }

      const query = "UPDATE restockOrder SET state=? WHERE id=?";
      this.db.run(query, [newState.toUpperCase(), id],
        function (err) {
          if (err)
            resolve({ code: 503 });
          else
            if (this.changes !== 0)
              resolve({ code: 200 });
            else
              resolve({ code: 404 });
        });
    });
  }

  /**
   * Given an array of objects {SKUId, RFID}, it associates the skuItems to the restock order.
   * @param {number} id 
   * @param {{SKUId:number, rfid:string}[]} skuItems 
   * @returns 
   */
  addSKUItems(id, skuItems) {

    /**
     * It adds the skuitem object to SKUITEM table.
     * @param {} addSKUItem
     * @param {} dayjsToDateAndTime 
     * @returns 
     */
    function addToSKUITEMTable(skuItem, addSKUItem, dayjsToDateAndTime) {
      return new Promise(async (resolve, reject) => {
        skuItem.DateOfStock = dayjsToDateAndTime(dayjs());
        Object.defineProperty(skuItem, "RFID", Object.getOwnPropertyDescriptor(skuItem, "rfid"));   // It renames the 'rfid' propery into 'RFID', as requested by addSKUItem method.
        try {
          const res = await addSKUItem(skuItem);
          if (res === false) {
            reject({ code: 422 });
          }
          resolve(true);
        }
        catch (e) {
          reject({ code: e.code });
        }
      });
    };

    /**
     * This function adds the skuitems (rfid) to restockTransactionSKU
     */
    const addToTransactionSKUTable = () => {
      return new Promise((resolve, reject) => {
        const query = ("INSERT INTO restockTransactionSKU (idRestockOrder, RFID) values " + "(?,?),".repeat(skuItems.length)).slice(0, -1);
        this.db.run(
          query,
          skuItems.flatMap(s => [id, s.rfid]),
          (err) => {
            if (err)
              return reject({ code: 503 });
            else
              return resolve({ code: 200 });
          }
        );
      })
    }

    return new Promise(async (resolve, reject) => {
      let ro;
      try {
        ro = await this.get(id);
      }
      catch (e) {
        reject({ code: e.code, data: "Error while getting restock order with id=" + id });
        return;
      }
      if (ro.data.state !== 'DELIVERED') {
        reject({ code: 422, data: "The state is not 'DELIVERED'" });
        return;
      }
      // END VALIDATION

      try {
        const resAddingSKUItems = await Promise.all(skuItems.map(skuItem => addToSKUITEMTable(skuItem, this.skuitemRepository.addSKUItem, this.dateHandler.DayjsToDateAndTime)));
        const result = await addToTransactionSKUTable();
        resolve({ code: result.code });
      }
      catch (e) {
        reject({ code: e.code });
      }


    })
  }

  /**
   * 
   * @param {number} id 
   * @param {{transportNote:{deliveryDate:string}}} json 
   * @returns 
   */
  addTransportNote(id, deliveryDate) {
    return new Promise(async (resolve, reject) => {
      let ro;
      try {
        ro = await this.get(id);
      }
      catch (e) {
        reject({ code: 404 });
        return;
      }
      if (ro.data.state !== 'DELIVERY' || dayjs(deliveryDate).isBefore(dayjs(ro.data.issueDate))) {
        reject({ code: 422 });
        return;
      }
      // END VALIDATION
      const query = "INSERT INTO transportNote (deliveryDate, ROid) values (?,?)";
      this.db.run(
        query,
        [deliveryDate, id],
        (err) => {
          if (err)
            reject({ code: 503 });
          else
            resolve({ code: 200 });
        }
      )
    })
  }

  /**
   * 
   * @param {number} id 
   * @returns 
   */
  returnItems(id) {
    return new Promise(async (resolve, reject) => {
      // VALIDATION
      let ro;
      try {
        ro = await this.get(id);
      }
      catch (e) {
        reject(e);
        return;
      }
      if (ro.data.state !== 'COMPLETEDRETURN') {
        reject({ code: 422 });
        return;
      }

      const query =
			'SELECT SKUId, restockTransactionItem.idItem as itemId, SKUITEM.RFID as rfid FROM ' +
			'restockTransactionSKU join TestResult on restockTransactionSKU.RFID = TestResult.rfid ' +
			'JOIN SKUITEM on TestResult.rfid = SKUITEM.RFID ' +
			'JOIN restockTransactionItem ON restockTransactionItem.idRestockOrder = restockTransactionSKU.idRestockOrder';
        'WHERE  restockTransactionSKU.idRestockOrder=? AND result="false"';
      this.db.all(
        query,
        id, (err, rows) => {
          if (err) {
            reject({ code: 500 })
            return;
          }
          resolve({ code: 200, data: rows });
        })
    });
  }

  deleteSequence = () => {
    return new Promise((resolve, reject) => {
      const sql = ' DELETE FROM sqlite_sequence WHERE name = ? ;';
      this.db.run(sql, "restockOrder", (err) => {
        if (err) {
          reject(err);
        }
        resolve(true);
      });
    });
  }

  deleteRestockOrderdata() {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM restockOrder;';
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

module.exports = restockOrderRepository;

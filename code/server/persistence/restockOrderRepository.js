const sqlite = require('sqlite3');
const { RestockOrder, possibleStates } = require('../model/restockOrder');
const dayjs = require('dayjs');
const dateHandler = require('./dateHandler');
const itemRepository = require('./itemRepository');
const skuItemRepository = require('./skuItemRepository');

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
  getOrderItems(id) {
    return new Promise((resolve) => {
      const query = "SELECT SKUId, quantity, item.description as description, item.price as price FROM restockTransactionItem JOIN item on restockTransactionItem.idItem=item.id WHERE idRestockOrder=?";
      this.db.all(query, [id],
        (err, rows) => {
          if (err)
            reject(err);
          else
            resolve(
              rows.map(row => ({ SKUId: row.SKUId, description: row.description, price: row.price, qty: row.quantity }))
            );
        })
    })
  }

  /**
   * It returns all the SKUItems (and the related information) associated to a restock order.
   * @param {number} id 
   * @returns {Promise}
   */
  getOrderRFIDs(id) {
    return new Promise((resolve) => {
      const query = "SELECT SKUITEM.RFID, SKUId FROM restockTransactionSKU join SKUITEM on restockTransactionSKU.RFID=SKUITEM.RFID WHERE restockTransactionSKU.idRestockOrder=?";
      this.db.all(query, id,
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
            resolve({ code: 500, data: { error: err } });
          else {
            ROs.push(new RestockOrder(row.id, dayjs(row.issueDate), row.state, [], row.supplierId, row.deliveryDate && row.state != 'ISSUED' ? { deliveryDate: dayjs(row.deliveryDate) } : {}, []));
          }
        },
        async () => {
          ROs = await Promise.all(ROs.map(async (ro) => {
            const [orderItems, orderRFIDs] = await Promise.all([this.getOrderItems(ro.id), this.getOrderRFIDs(ro.id)])
              .catch((err) => resolve({ code: 500, data: err }));
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
      if (isNaN(parseInt(id))) {
        reject({ code: 422 });
        return;
      }
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
            const [orderItems, orderRFIDs] = await Promise.all([this.getOrderItems(RO.id), this.getOrderRFIDs(RO.id)])
              .catch(() => reject({ code: 500 }));
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

    function addProducts(idRO, skuid, quantity, itemRepo, db) {
      return new Promise(async (resolve, reject) => {
        const item = await itemRepo.getItemsBySupplierAndSKUId({ supplierId: ro.supplierId, SKUId: skuid, id: '' });
        if (!item[0]) {
          reject("Error while getting item");
          return;
        }
        const query = "INSERT INTO restockTransactionItem (idRestockOrder, quantity, idItem) VALUES(?,?,?)";
        db.run(query, [idRO, quantity, item[0].id], (err) => {
          if (err)
            reject(err);
          else
            resolve(true);
        });
      })
    }


    return new Promise(async (resolve) => {
      // validation stuff
      if (!this.dateHandler.isDateAndTimeValid(ro.issueDate) || ro.products.length === 0 || !ro.products.every(p => typeof p.qty === 'number' && typeof p.price === 'number' && typeof p.description === 'string')) {
        resolve({ code: 422, data: "Validation of request body failed" });
        return;
      }

      const roID = await addRO();

      Promise.all(ro.products.map(p => addProducts(roID, p.SKUId, p.qty, this.itemRepo, this.db)))
        .then(() => resolve({ code: 201, data: "Restock order successfully created" }))
        .catch((e) => resolve({ code: 503, data: "Generic error: " + e }));
    })
  }

  /**
   * It deletes a restock order.
   * @param {number} id 
   * @returns {Promise}
   */
  remove(id) {
    return new Promise((resolve) => {
      // VALIDATION
      if (isNaN(parseInt(id))) {
        resolve({ code: 422 });
        return;
      }
      const query = "DELETE FROM restockOrder WHERE id=?";
      this.db.run(
        query,
        parseInt(id), function (err) {
          if (err)
            resolve({ code: 503 });
          else {
            if (this.changes === 0)
              resolve({ code: 422 });
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
            throw { code: 422 };
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
      // VALIDATION
      if (typeof parseInt(id) !== 'number' || !skuItems.every(s => typeof s.SKUId === 'number' && typeof s.rfid === 'string')) {
        resolve({ code: 422 });
        return;
      }
      let ro;
      try {
        ro = await this.get(id);
      }
      catch (e) {
        resolve(e.code);
        return;
      }
      if (ro.data.state !== 'DELIVERED') {
        resolve({ code: 422 });
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
  addTransportNote(id, json) {
    return new Promise(async (resolve) => {
      // VALIDATION
      if (typeof parseInt(id) !== 'number' || typeof json.transportNote === 'undefined' || typeof json.transportNote.deliveryDate !== 'string' || !dayjs(json.transportNote.deliveryDate).isValid()) {
        resolve({ code: 422 });
        return;
      }
      let ro;
      try {
        ro = await this.get(id);
      }
      catch (e) {
        resolve({ code: 404 });
        return;
      }
      if (ro.data.state !== 'DELIVERY' || dayjs(json.transportNote.deliveryDate).isBefore(dayjs(ro.data.issueDate))) {
        resolve({ code: 422 });
        return;
      }
      // END VALIDATION
      const query = "INSERT INTO transportNote (deliveryDate, ROid) values (?,?)";
      this.db.run(
        query,
        [json.transportNote.deliveryDate, id],
        (err) => {
          if (err)
            resolve({ code: 503 });
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
        ro = await this.get(parseInt(id));
      }
      catch (e) {
        reject(e);
        return;
      }
      if (ro.data.state !== 'COMPLETEDRETURN') {
        reject({ code: 422 });
        return;
      }

      const query = 'SELECT SKUId, SKUITEM.RFID FROM ' +
        'restockTransactionSKU join TestResult on restockTransactionSKU.RFID = TestResult.rfid ' +
        'JOIN SKUITEM on TestResult.rfid = SKUITEM.RFID ' +
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


}

module.exports = restockOrderRepository;

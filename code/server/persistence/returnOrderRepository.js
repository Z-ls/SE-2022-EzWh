const sqlite = require('sqlite3');
const RETURN = require('../model/returnOrder');
const skuItemRepository = require('./skuItemRepository');

function retRepository(){
    const db = new sqlite.Database('../ezwh.db', (err) => {
        if (err) {
            throw err;
        }
    });

db.run("PRAGMA foreign_keys = ON");
this.skuitemRepository = new skuItemRepository();

    this.dropTable = () =>{
        return new Promise((resolve, reject) =>{
            const sql = 'DROP TABLE IF EXISTS returnOrder';
            db.run(sql, (err) => {
                if(err){
                    reject(err);
                    return;
                }
                resolve(true);
            });
        });
    }

    this.deleteReturnOrderdata = () =>{
        return new Promise((resolve, reject) =>{
            const sql = 'DELETE FROM returnOrder; DELETE FROM sqlite_sequence WHERE name = "returnOrder";';
            db.run(sql, (err) => {
                if(err){
                    reject(err);
                    return;
                }
                resolve(true);
            });
        });
    }    

this.newTableRETURN = () =>{
    return new Promise((resolve, reject) => {
        const sql = 'CREATE TABLE IF NOT EXISTS returnOrder(id INTEGER PRIMARY KEY AUTOINCREMENT, returnDate DATE, restockOrderId INT FOREIGN KEY(restockOrderId) REFERENCES restockOrder(id))';
        db.run(sql, (err) => {
            if(err)
            {
                reject(err);
                return;
            }
            resolve('Row was added to the table: ' + this.lastID);
        });
    });
}

this.getProductsbyID = (id) =>{
    return new Promise((resolve, reject) => {
        const sql = "SELECT S.SKUId as SKUId, S.description  AS description, S.price AS price, S.RFID AS RFID "
        + "FROM returnOrder R, returnOrderTransaction RT, SKUITEM SI, SKU S "
        + "WHERE WHERE R.restockOrderID = RT.idReturnOrder AND RT.RFID=SI.RFID AND SI.SKUid=S.id AND idReturnOrder = ?";
        this.db.all(sql, id, (err, rows) => {
           if (err) {
            reject(err);
            return;
           }
           resolve(rows);
        });
    });
}

this.getReturnOrders = ()=>
{
    return new Promise((resolve,reject)=>{
        const sql = "SELECT * FROM returnOrder";
        db.all(sql, (err, rows) =>{
            if(err){
                reject(err);
            }else{
                resolve(rows.map((ro)=>{
                    return new POS(ro.id, dayjs(ro.returnDate).format("YYYY/MM/DD HH:mm"), ro.restockOrderID);
                }));
            }
        });
    });
}

this.getReturnOrderbyID = (id)=>
{
    return new Promise((resolve,reject)=>{
        const sql = "SELECT * FROM returnOrder WHERE id = ?";
        db.all(sql, (err, rows) =>{
            if(err){
                reject(err);
            }else{
                resolve(rows.map((ro)=>{
                    return new POS(ro.id, dayjs(ro.returnDate).format("YYYY/MM/DD HH:mm"), ro.restockOrderID);
                }));
            }
        });
    });
}

this.deleteReturnOrder = (id)=>
{
    return new Promise((resolve, reject) =>{
        const sql = 'DELETE FROM returnOrder WHERE id = ?';
        db.run(sql,id,(err)=>{
            if(err)
            {
                reject(err);
            }else{
                resolve(true);
            }
        });
    });
}

this.addReturnOrder = (returnDate, products, restockOrderID)=>
{ 
    const addReturnOrderTransaction = () =>
    {
        return new Promise((resolve, reject) =>{
            const sql = ("INSERT INTO returnOrderTransaction (idReturnOrder,RFID) values " + "(?,?),".repeat(products.length)).slice(0, -1);
            db.run(sql,[restockOrderID, products.flatMap(p => p.RFID)],(err)=>{
                if(err)
                {
                    reject(err);
                }else{
                    resolve(true);
                }
            });
        });
    }
    return new Promise((resolve, reject) =>{
        const sql = 'INSERT INTO returnOrder (returnDate,restockOrderID) VALUES(?,?)';
        const result = addReturnOrderTransaction();
        db.run(sql,[returnDate, restockOrderID],(err)=>{
            if(err)
            {
                reject(err);
            }else{
                resolve(true);
            }
        });
    });
  }
}


module.exports = retRepository;
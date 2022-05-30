const sqlite = require('sqlite3');
const RETURN = require('../model/returnOrder');
const skuItemRepository = require('./skuItemRepository');
const dayjs = require('dayjs');
const dateHandler = require('./dateHandler');

function retRepository(){
    const db = new sqlite.Database('../ezwh.db', (err) => {
        if (err) {
            throw err;
        }
    });

db.run("PRAGMA foreign_keys = ON");
this.skuitemRepository = new skuItemRepository();
this.dateHandler = new dateHandler();
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
        const sql = "SELECT S.id as SKUId, I.description  AS description, I.price AS price, SI.RFID AS RFID "
        + "FROM returnOrder R, returnOrderTransaction RT, SKUITEM SI, SKU S, ITEM I "
        + "WHERE R.id = RT.idReturnOrder AND I.SKUId = S.id AND RT.RFID=SI.RFID AND SI.SKUId=S.id AND R.id = ?";
        db.all(sql, id, (err, rows) => {
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
                    return new RETURN(ro.id, dayjs(ro.returnDate).format("YYYY/MM/DD HH:mm"), ro.products, ro.restockOrderId);
                }));
            }
        });
    });
}

this.getReturnOrderbyID = (id)=>
{
    return new Promise((resolve,reject)=>{
        const sql = "SELECT * FROM returnOrder WHERE id = ?";
        db.all(sql, id, (err, rows) =>{
            if(err){
                reject(err);
            }else{
                resolve(rows.map((ro)=>{
                    return new RETURN(ro.id, dayjs(ro.returnDate).format("YYYY/MM/DD HH:mm"), ro.products, ro.restockOrderId);
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

this.addReturnOrder = (returnDate, restockOrderID)=>
{ 
    return new Promise((resolve, reject) =>{
        const sql = 'INSERT INTO returnOrder (returnDate,restockOrderID) VALUES(?,?)';
        
        db.run(sql,[returnDate, restockOrderID],function (err){
            if(err)
            {
                reject(err);
            }else{
                resolve(this.lastID);
            }
        });
    });
}


this.addReturnOrderTransaction = (returnOrderID,products) =>
    {
        return new Promise((resolve, reject) =>{
            const sql = ("INSERT INTO returnOrderTransaction (idReturnOrder,RFID) values " + "(?,?),".repeat(products.length)).slice(0, -1);
            db.run(sql,[returnOrderID, products.flatMap(p => p.RFID)],(err)=>{
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
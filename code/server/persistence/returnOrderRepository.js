const sqlite = require('sqlite3');
const RETURN = require('../model/returnOrder');

function retRepository(){
    const db = new sqlite.Database('../ezwh.db', (err) => {
        if (err) {
            throw err;
        }
    });

db.run("PRAGMA foreign_keys = ON");

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

this.getReturnOrders = ()=>
{
    return new Promise((resolve,reject)=>{
        const sql = "SELECT R.id AS id, R.returnDate AS returnDate, R.restockOrderID AS restockOrderId, S.SKUId AS SKUId, "
        + "I.description  AS description, I.price AS price, S.RFID AS RFID " 
        + "FROM returnOrder R, restockOrder O, restockTransactionItem TI, restockTransactionSKU TS, ITEM I, SKUITEM S "
        + "WHERE R.restockOrderID = O.id AND O.id = TI.idRestockOrder AND O.id = TS.idRestockOrder AND I.id = TI.idItem AND S.RFID = TS.RFID";
        db.all(sql, (err, rows) =>{
            if(err){
                reject(err);
            }else{
                resolve(rows);
            }
        });
    });
}

this.getReturnOrderbyID = (id)=>
{
    return new Promise((resolve,reject)=>{
        const sql = 'SELECT R.id AS id, R.returnDate AS returnDate, R.restockOrderID AS restockOrderId, S.SKUId AS SKUId, I.description  AS description, I.price AS price, S.RFID AS RFID' 
        + ' FROM returnOrder R, restockOrder O, restockTransactionItem TI, restockTransactionSKU TS, ITEM I, SKUITEM S  '
        + 'WHERE R.restockOrderID = O.id AND O.id = TI.idRestockOrder AND O.id = TS.idRestockOrder AND I.id = TI.idItem AND S.RFID = TS.RFID AND R.id = ?';
        db.all(sql, id,(err, rows) =>{
            if(err){
                reject(err);
            }else{
                resolve(rows);
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

this.addReturnOrder = (r)=>
{
    return new Promise((resolve, reject) =>{
        const sql = 'INSERT INTO returnOrder (returnDate,restockOrderID) VALUES(?,?)';
        db.run(sql,[r.returnDate, r.restockOrderID],(err)=>{
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
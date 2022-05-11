const dayjs = require('dayjs')
const sqlite = require('sqlite3');
const SKUItem = require('../model/skuItem');

function skuItemRepository(){
    const db = new sqlite.Database('../ezwh.db', (err) => {
        if (err) {
            throw err;
        }
    });

    db.run("PRAGMA foreign_keys = ON");

    this.dropTable = () =>{
        return new Promise((resolve, reject) =>{
            const sql = 'DROP TABLE IF EXISTS SKUITEM';
            db.run(sql, (err) => {
                if(err){
                    reject(err);
                    return;
                }
                resolve(true);
            });
        });
    }

    this.newTableSKUItem = () =>{
        return new Promise((resolve, reject) => {
            const sql = 'CREATE TABLE IF NOT EXISTS SKUITEM(RFID VARCHAR PRIMARY KEY, SKUId INTEGER, Available INTEGER, DateOfStock DATE, FOREIGN KEY(SKUId) REFERENCES SKU(id) ON DELETE CASCADE);';
            db.run(sql, (err) => {
                if(err)
                {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

    this.getSKUItems = ()=>
    {
        return new Promise((resolve,reject)=>{
            const sql = 'SELECT * FROM SKUITEM';
            db.all(sql, (err, rows) =>{
                if(err){
                    reject(err);
                }else{
                    resolve(rows.map((s)=>{
                        return new SKUItem(s.RFID,s.SKUId, s.Available, dayjs(s.DateOfStock).format("YYYY/MM/DD HH:mm"));
                    }));
                }
            });
        });
    }

    this.getSKUsBySKUId = (id)=>
    {
        return new Promise((resolve,reject)=>{
            const sql = 'SELECT * FROM SKUITEM WHERE SKUId = ?';
            db.all(sql, [id], (err, rows) =>{
                if(err){
                    reject(err);
                }else{
                    resolve(rows.map((s)=>{
                        if(s.DateOfStock !== null)
                        return new SKUItem(s.RFID,s.SKUId, s.Available, dayjs(s.DateOfStock).format("YYYY/MM/DD HH:mm"));
                        else
                        return new SKUItem(s.RFID,s.SKUId, s.Available, s.DateOfStock);
                    }));
                }
            });
        });
    }

    this.getSingleSKUItem = (rfid)=>
    {
        return new Promise((resolve,reject)=>{
            const sql = 'SELECT * FROM SKUITEM WHERE RFID = ?';
            db.all(sql, [rfid], (err, rows) =>{
                if(err){
                    reject(err);
                }else{
                    resolve(rows.map((s)=>{
                        if(s.DateOfStock !== null)
                        return new SKUItem(s.RFID,s.SKUId, s.Available, dayjs(s.DateOfStock).format("YYYY/MM/DD HH:mm"));
                        else
                        return new SKUItem(s.RFID,s.SKUId, s.Available, s.DateOfStock);
                    }));
                }
            });
        });
    }

    this.addSKUItem = (skuItem)=>
    {
        return new Promise((resolve, reject) =>{
            const sql = 'INSERT INTO SKUITEM (RFID,SKUId,DateOfStock) VALUES(?,?,?)';
            db.run(sql,[skuItem.RFID, skuItem.SKUId,skuItem.DateOfStock],(err)=>{
                if(err)
                {
                    resolve(false);
                }else{
                    resolve(true);
                }
            });
        });
    }

    this.editSKUItem = (skuItem,rfid)=>
    {
        return new Promise((resolve, reject) =>{
            const sql = 'UPDATE SKUITEM SET RFID = ?, Available = ?, DateOfStock = ? WHERE RFID = ?;';
            db.run(sql,[skuItem.newRFID, skuItem.newAvailable,skuItem.newDateOfStock,rfid],(err)=>{
                if(err)
                {
                    reject(err);
                }else{
                    resolve(true);
                }
            });
        });
    }

    this.deleteSKUItem = (rfid)=>
    {
        return new Promise((resolve, reject) =>{
            const sql = 'DELETE FROM SKUITEM WHERE RFID = ?';
            db.run(sql,rfid,function(err){
                if(err)
                {
                    reject(err);
                }else{
                    if(this.changes ===0)
                    resolve(false);
                    else
                    resolve(true);
                }
            });
        });
    }
}

module.exports = skuItemRepository;
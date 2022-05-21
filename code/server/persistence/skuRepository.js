const sqlite = require('sqlite3');
const SKU = require('../model/sku');
function skuRepository()
{
    const db = new sqlite.Database('../ezwh.db', (err) => {
        if (err) {
            throw err;
        }
    });

    db.run("PRAGMA foreign_keys = ON");

    this.dropTable = () =>{
        return new Promise((resolve, reject) =>{
            const sql = 'DROP TABLE IF EXISTS SKU';
            db.run(sql, (err) => {
                if(err){
                    reject(err);
                    return;
                }
                resolve(true);
            });
        });
    }

    this.deleteSKUdata = () =>{
        return new Promise((resolve, reject) =>{
            const sql = 'DELETE FROM SKU; DELETE FROM sqlite_sequence WHERE name = "SKU";';
            db.run(sql, (err) => {
                if(err){
                    reject(err);
                    return;
                }
                resolve(true);
            });
        });
    }

    this.newTableSKU = () =>{
        return new Promise((resolve, reject) => {
            const sql = 'CREATE TABLE IF NOT EXISTS SKU(id INTEGER PRIMARY KEY AUTOINCREMENT, description VARCHAR, weight REAL, volume REAL, notes VARCHAR, position VARCHAR, availablequantity INTEGER, price REAL)';
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

    this.addSKU = (sku)=>
    {
        return new Promise((resolve, reject) =>{
            const sql = 'INSERT INTO SKU (description,weight,volume,notes,availablequantity,price) VALUES(?,?,?,?,?,?)';
            db.run(sql,[sku.description, sku.weight, sku.volume, sku.notes, sku.availableQuantity, sku.price],(err)=>{
                if(err)
                {
                    reject(err);
                }else{
                    resolve(true);
                }
            });
        });
    }

    this.editSKU = (sku,id)=>
    {
        return new Promise((resolve, reject) =>{
            const sql = 'UPDATE SKU SET description = ? ,weight= ?,volume= ?,notes= ?,availablequantity= ?,price= ? WHERE id = ?';
            db.run(sql,[sku.newDescription, sku.newWeight, sku.newVolume, sku.newNotes, sku.newAvailableQuantity, sku.newPrice, id],function(err){
                if(err)
                {
                    reject(err);
                }else{
                    if(this.changes === 0)
                    {
                        resolve(false);
                    }else{
                        resolve(true);
                    }
                }
            });
        });
    }

    this.editSKUPosition = (position,id)=>
    {
        return new Promise((resolve, reject) =>{
            const sql = 'UPDATE SKU SET position = ? WHERE id = ?';
            db.run(sql,[position,id],function(err){
                if(err)
                {
                    reject(err);
                }else{
                    if(this.changes === 0)
                    {
                    resolve(false);
                    }else{
                        resolve(true);
                    }
                }
            });
        });
    }

    this.getSKUS = ()=>
    {
        return new Promise((resolve,reject)=>{
            const sql = 'SELECT * FROM SKU';
            db.all(sql, (err, rows) =>{
                if(err){
                    reject(err);
                }else{
                    resolve(rows.map((s)=>{
                        return new SKU(s.id,s.description,s.weight,s.volume,s.notes,s.position, s.availablequantity, s.price);
                    }));
                }
            });
        });
    }

    this.getSkuById = (id) =>{
        return new Promise((resolve,reject)=>{
            const sql = 'SELECT * FROM SKU WHERE id = ?';
            db.all(sql, id, (err, rows) =>{
                if(err){
                    reject(err);
                }else{
                    resolve(rows.map((s)=>{
                        return new SKU(s.id,s.description,s.weight,s.volume,s.notes,s.position, s.availablequantity, s.price);
                    }));
                }
            });
        });
    }

    this.getSKUByPosition = (position) =>{
        return new Promise((resolve,reject)=>{
            const sql = 'SELECT * FROM SKU WHERE position = ?';
            db.all(sql, position, (err, rows) =>{
                if(err){
                    reject(err);
                }else{
                    resolve(rows.map((s)=>{
                        return new SKU(s.id,s.description,s.weight,s.volume,s.notes,s.position, s.availablequantity, s.price);
                    }));
                }
            });
        });
    }

    this.deleteSKU = (id)=>
    {
        return new Promise((resolve, reject) =>{
            const sql = 'DELETE FROM SKU WHERE id = ?';
            db.run(sql,id,function (err){
                if(err)
                {      
                    reject(err);
                }else{
                    if(this.changes === 0)
                    {
                        resolve(false);
                    }else{
                        resolve(true);
                    }
                    
                }
            });
        });
    }
}

module.exports = skuRepository;
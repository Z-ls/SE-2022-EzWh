const sqlite = require('sqlite3');
const Item = require('../model/item');

function itemRepository(){
    const db = new sqlite.Database('../ezwh.db', (err) => {
        if (err) {
            throw err;
        }
    });

    db.run("PRAGMA foreign_keys = ON");

    this.dropTable = () =>{
        return new Promise((resolve, reject) =>{
            const sql = 'DROP TABLE IF EXISTS ITEM';
            db.run(sql, (err) => {
                if(err){
                    reject(err);
                    return;
                }
                resolve(true);
            });
        });
    }

    this.deleteItemdata = () =>{
        return new Promise((resolve, reject) =>{
            const sql = 'DELETE FROM ITEM; DELETE FROM sqlite_sequence WHERE name = "ITEM";';
            db.run(sql, (err) => {
                if(err){
                    reject(err);
                    return;
                }
                resolve(true);
            });
        });
    }

    this.newTableItem = () =>{
        return new Promise((resolve, reject) => {
            const sql = 'CREATE TABLE IF NOT EXISTS ITEM(id INTEGER, description VARCHAR, price REAL, SKUId INTEGER, supplierId INTEGER, PRIMARY KEY(id,supplierId), FOREIGN KEY(supplierId) REFERENCES user(id) ON DELETE CASCADE, FOREIGN KEY(SKUId) REFERENCES SKU(id));';
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

    this.getItems = ()=>
    {
        return new Promise((resolve,reject)=>{
            const sql = 'SELECT * FROM ITEM';
            db.all(sql, (err, rows) =>{
                if(err){
                    reject(err);
                }else{
                    resolve(rows.map((i)=>{
                        return new Item(i.id,i.description,i.price,i.SKUId,i.supplierId);
                    }));
                }
            });
        });
    }

    this.getSingleItem = (id)=>
    {
        return new Promise((resolve,reject)=>{
            const sql = 'SELECT * FROM ITEM WHERE id = ?';
            db.all(sql, [id], (err, rows) =>{
                if(err){
                    reject(err);
                }else{
                    resolve(rows.map((i)=>{
                        return new Item(i.id,i.description,i.price,i.SKUId,i.supplierId);
                    }));
                }
            });
        });
    }

    this.getItemsBySupplierAndSKUId = (item) =>{
        return new Promise((resolve,reject)=>{
            const sql = 'SELECT * FROM ITEM WHERE (supplierId = ? AND SKUId = ?) OR (supplierId = ? AND id = ?)';
            db.all(sql, [item.supplierId,item.SKUId, item.supplierId, item.id], (err, rows) =>{
                if(err){
                    reject(err);
                }else{
                    resolve(rows.map((i)=>{
                        return new Item(i.id,i.description,i.price,i.SKUId,i.supplierId);
                    }));
                }
            });
        });
    }

    this.addItem = (item)=>
    {
        return new Promise((resolve, reject) =>{
            const sql = 'INSERT INTO ITEM (id,description,price,SKUId,supplierId) VALUES(?,?,?,?,?)';
            db.run(sql,[item.id,item.description,item.price,item.SKUId,item.supplierId],(err)=>{
                if(err)
                {
                    resolve(false);
                }else{
                    resolve(true);
                }
            });
        });
    }

    this.editItem = (item, id) =>{
        return new Promise((resolve, reject) =>{
            const sql = 'UPDATE ITEM SET description = ?, price = ? WHERE ID = ?;';
            db.run(sql,[item.newDescription,item.newPrice,id],(err)=>{
                if(err)
                {
                    reject(err);
                }else{
                    resolve(true);
                }
            });
        });
    }

    this.deleteItem = (id) => {
        return new Promise((resolve, reject) =>{
            const sql = 'DELETE FROM ITEM WHERE id = ?';
            db.run(sql,id,function(err){
                if(err)
                {
                    reject(err);
                }else{
                    if(this.changes === 0)
                    resolve(false);
                    else
                    resolve(true);
                }
            });
        });
    }
}

module.exports = itemRepository;
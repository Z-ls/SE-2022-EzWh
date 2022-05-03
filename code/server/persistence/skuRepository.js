const sqlite = require('sqlite3');
const SKU = require('../model/sku');
function skuRepository()
{
    const db = new sqlite.Database('../ezwh.db', (err) => {
        if (err) {
            throw err;
        }
    });

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

    this.newTableSKU = () =>{
        return new Promise((resolve, reject) => {
            const sql = 'CREATE TABLE IF NOT EXISTS SKU(id INTEGER PRIMARY KEY AUTOINCREMENT, description VARCHAR, weight REAL, volume REAL, notes VARCHAR, position INTEGER, availablequantity INTEGER, price REAL)';
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

    this.addSKU = (sku)=>
    {
        return new Promise((resolve, reject) =>{
            const sql = 'INSERT INTO SKU (description,weight,volume,notes,position,availablequantity,price) VALUES(?,?,?,?,?,?,?)';
            db.run(sql,[sku.description, sku.weight, sku.volume, sku.notes, sku.position, sku.availableQuantity, sku.price],(err)=>{
                if(err)
                {
                    reject(err);
                }else{
                    resolve(true);
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
}

module.exports = skuRepository;
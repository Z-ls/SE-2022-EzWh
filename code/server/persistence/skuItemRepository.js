const dayjs = require('dayjs')
const sqlite = require('sqlite3');
const SKUItem = require('../model/skuItem');

function skuItemRepository(){
    const db = new sqlite.Database('../ezwh.db', (err) => {
        if (err) {
            throw err;
        }
    });

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
            const sql = 'CREATE TABLE IF NOT EXISTS SKUITEM(RFID VARCHAR PRIMARY KEY, SKUId INTEGER, Available INTEGER, DateOfStock DATE, FOREIGN KEY(SKUId) REFERENCES SKU(id))';
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

    this.addSKUItem = (skuItem)=>
    {
        console.log(skuItem);
        return new Promise((resolve, reject) =>{
            const sql = 'INSERT INTO SKUITEM (RFID,SKUId,DateOfStock) VALUES(?,?,?)';
            db.run(sql,[skuItem.RFID, skuItem.SKUId,skuItem.DateOfStock],(err)=>{
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

module.exports = skuItemRepository;
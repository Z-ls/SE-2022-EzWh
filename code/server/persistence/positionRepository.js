const sqlite = require('sqlite3');
const POS = require('../model/position');
function posRepository()
{
    const db = new sqlite.Database('../ezwh.db', (err) => {
        if (err) {
            throw err;
        }
    });

db.run("PRAGMA foreign_keys = ON");

    this.dropTable = () =>{
        return new Promise((resolve, reject) =>{
            const sql = 'DROP TABLE IF EXISTS position';
            db.run(sql, (err) => {
                if(err){
                    reject(err);
                    return;
                }
                resolve(true);
            });
        });
    }

    this.newTablePOS = () =>{
        return new Promise((resolve, reject) => {
            const sql = 'CREATE TABLE IF NOT EXISTS position(positionID TEXT, aisleID TEXT, row TEXT, col TEXT, maxWeight REAL, maxVolume REAL, occupiedWeight REAL, occupiedVolume REAL)';
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

    this.addPOS = (pos)=>
    {
        return new Promise((resolve, reject) =>{
            const sql = 'INSERT INTO position (positionID,aisleID,row,col,maxWeight,maxVolume,occupiedWeight,occupiedVolume) VALUES(?,?,?,?,?,?,?,?)';
            db.run(sql,[pos.positionID, pos.aisleID, pos.row, pos.col, pos.maxWeight, pos.maxVolume, 0, 0],(err)=>{
                if(err)
                {
                    reject(err);
                }else{
                    resolve(true);
                }
            });
        });
    }

    this.editPOS = (pos,id)=>
    {
        return new Promise((resolve, reject) =>{
            const sql = 'UPDATE position SET positionID = ?, aisleID = ? ,row= ?,col= ?,maxWeight= ?,maxVolume= ?,occupiedWeight= ?,occupiedVolume= ? WHERE positionID = ?';
            db.run(sql,[pos.newAisleID+pos.newRow+pos.newCol, pos.newAisleID, pos.newRow, pos.newCol, pos.newMaxWeight, pos.newMaxVolume, pos.newOccupiedWeight, pos.newOccupiedVolume, id],(err)=>{
                if(err)
                {
                    reject(err);
                }else{
                    resolve(true);
                }
            });
        });
    }

    this.editPOSID = (pos, id)=>
    {
        return new Promise((resolve, reject) =>{
            const sql = 'UPDATE position SET positionID = ?, aisleID = ?, row = ?, col = ? WHERE positionID = ?';
            db.run(sql,[pos.newPositionID, pos.newPositionID.slice(0,4), pos.newPositionID.slice(4,8), pos.newPositionID.slice(8,12), id],(err)=>{
                if(err)
                {
                    reject(err);
                }else{
                    resolve(true);
                }
            });
        });
    }

    this.getPOS = ()=>
    {
        return new Promise((resolve,reject)=>{
            const sql = 'SELECT * FROM position';
            db.all(sql, (err, rows) =>{
                if(err){
                    reject(err);
                }else{
                    resolve(rows.map((p)=>{
                        return new POS(p.positionID, p.aisleID, p.row, p.col, p.maxWeight, p.maxVolume, p.occupiedWeight, p.occupiedVolume);
                    }));
                }
            });
        });
    }

    this.deletePOS = (id)=>
    {
        return new Promise((resolve, reject) =>{
            const sql = 'DELETE FROM position WHERE positionID = ?';
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

this.getPOSbyID = (id)=>
{
    return new Promise((resolve,reject)=>{
        const sql = 'SELECT * FROM position WHERE positionID=?';
        db.all(sql, id,(err, rows) =>{
            if(err){
                reject(err);
            }else{
                resolve(rows.map((p)=>{
                    return new POS(p.positionID, p.aisleID, p.row, p.col, p.maxWeight, p.maxVolume, p.occupiedWeight, p.occupiedVolume);
                }));
            }
        });
    });
}

}


module.exports = posRepository;
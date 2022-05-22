const dayjs = require("dayjs");
const sqlite = require('sqlite3');

class TestResultRepository {

    constructor() {
        this.db = new sqlite.Database("../ezwh.db", (err) => {
            if (err) throw err;
        });
        this.db.run("PRAGMA foreign_keys = ON");
    }

    dropTable() {
        return new Promise((resolve, reject) => {
            const sql = 'DROP TABLE IF EXISTS TestResult';
            this.db.run(sql, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }

    newTestResultTable() {
        return new Promise((resolve, reject) => {
            const sql = 'CREATE TABLE IF NOT EXISTS TestResult(' +
                'id INTEGER PRIMARY KEY AUTOINCREMENT, ' +
                'idTestDescriptor INTEGER NOT NULL, ' +
                'rfid VARCHAR NOT NULL, ' +
                'Date DATE NOT NULL, ' +
                'Result VARCHAR NOT NULL,' +
                'FOREIGN KEY(idTestDescriptor) REFERENCES TestDescriptor(id) ON DELETE CASCADE, ' +
                'FOREIGN KEY(rfid) REFERENCES SkuItem(RFID) ON DELETE CASCADE' +
                ');'
            this.db.run(sql, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }
    
    getTestResults() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM TestResult';
            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                const trs = rows.map((tr) => (
                    {
                        "id": tr.id,
                        "idTestDescriptor": tr.idTestDescriptor,
                        "Date": dayjs(tr.Date).format("YYYY/MM/DD"),
                        "Result": tr.Result === "true"
                    }
                ));
                resolve(trs);
            });
        });
    }

    getTestResultById(id) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM TestResult WHERE id = ?';
            this.db.get(sql, [id], (err, row) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (!row) {
                    reject(404);
                    return;
                }
                const tr = (
                    {
                        "id": row.id,
                        "idTestDescriptor": row.idTestDescriptor,
                        "Date": dayjs(row.Date).format("YYYY/MM/DD"),
                        "Result": row.Result === "true"
                    }
                )
                resolve(tr);
            });
        });
    }

    getTestResultsByRfid(rfid) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM TestResult WHERE rfid = ?';
            this.db.all(sql, [rfid], (err, rows) => {
                if (err) {
                    reject(500);
                    return;
                }
                const tr = rows.map(r => (
                    {
                        "id": r.id,
                        "idTestDescriptor": r.idTestDescriptor,
                        "Date": dayjs(r.Date).format("YYYY/MM/DD"),
                        "Result": r.Result === "true"
                    }
                ));
                resolve(tr);
            });
        })
    }

    getTestResultsByTdId(tdId) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM TestResult WHERE idTestDescriptor = ?';
            this.db.all(sql, [tdId], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (rows.length === 0) {
                    reject(404);
                    return;
                }
                resolve(rows);
            });
        });
    }

    addTestResult(nTR) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO TestResult(' +
                'idTestDescriptor, ' +
                'rfid, ' +
                'Date,' +
                'Result) ' +
                'VALUES(?, ?, (SELECT DATE(?)), ?);';
            this.db.run(sql, [
                nTR.idTestDescriptor,
                nTR.rfid,
                dayjs(nTR.Date).isValid() ?
                    dayjs(nTR.Date).format("YYYY-MM-DD") :
                    null,
                typeof nTR.Result === "boolean" ?
                    nTR.Result.toString() :
                    null
            ], function (err) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(true);
            });
        });
    }

    updateTestResult(id, nTR) {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE TestResult SET ' +
                `idTestDescriptor = ?, ` +
                `Date = (SELECT DATE(?)), ` +
                `Result = ? ` +
                `WHERE id = ?;`;
            this.db.run(sql, [
                nTR.newIdTestDescriptor,
                dayjs(nTR.newDate).isValid() ?
                    dayjs(nTR.newDate).format("YYYY-MM-DD") :
                    null,
                typeof nTR.newResult === "boolean" ?
                    nTR.newResult.toString() :
                    null,
                id
            ], function (err) {
                if (err) {
                    reject(err);
                    return;
                }
                if (this.changes === 0) {
                    reject(404);
                    return;
                }
                resolve(nTR);
            });
        });
    }

    deleteTestResult(id) {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM TestResult WHERE id = ?';
            this.db.run(sql, [id], function (err) {
                if (err) {
                    reject(err);
                    return;
                }
                if (this.changes === 0) {
                    reject(404);
                    return;
                }
                resolve(id);
            });
        });
    }

    deleteTestResultdata(){
        return new Promise((resolve, reject) =>{
            const sql = 'DELETE FROM TestResult; DELETE FROM sqlite_sequence WHERE name = "TestResult";';
            this.db.run(sql, (err) => {
                if(err){
                    reject(err);
                    return;
                }
                resolve(true);
            });
        });
    }
}

module.exports = TestResultRepository;

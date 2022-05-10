const dayjs = require('dayjs');

class TestResultRepository {

    sqlite = require('sqlite3');

    constructor() {
        this.db = new this.sqlite.Database("EzWh.db", (err) => {
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
            // const sql = 'CREATE TABLE IF NOT EXISTS TestResult(' +
            //     'id INTEGER PRIMARY KEY AUTOINCREMENT, ' +
            //     'idTestDescriptor INTEGER NOT NULL,' +
            //     'Date DATE NOT NULL, ' +
            //     'Result VARCHAR NOT NULL,' +
            //     'FOREIGN KEY(idTestDescriptor) REFERENCES TestDescriptor(id)' +
            //     ');'
            const sql = 'CREATE TABLE IF NOT EXISTS TestResult(' +
                'id INTEGER PRIMARY KEY AUTOINCREMENT, ' +
                'idTestDescriptor INTEGER NOT NULL, ' +
                'rfid VARCHAR NOT NULL, ' +
                'Date DATE NOT NULL, ' +
                'Result VARCHAR NOT NULL,' +
                'FOREIGN KEY(idTestDescriptor) REFERENCES TestDescriptor(id), ' +
                'FOREIGN KEY(rfid) REFERENCES SkuItem(RFID)' +
                ');'
            this.db.run(sql, (err) => {
                if (err) {
                    reject(err);
                    return false;
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
                    return "500";
                }
                if (rows.length === 0) {
                    reject(err);
                    return;
                }
                const trs = rows.map((tr) => (
                    {
                        id: parseInt(tr.id),
                        idTestDescriptor: tr.idTestDescriptor,
                        Date: tr.Date,
                        Result: tr.Result === "true"
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
                    return "500";
                }
                if (!row) {
                    reject(err);
                    return;
                }
                const tr = (
                    {
                        "rfid": row.rfid,
                        "id": row.id,
                        "idTestDescriptor": row.idTestDescriptor,
                        "Date": row.Date,
                        "Result": row.Result === "true"
                    }
                )
                resolve(tr);
            });
        });
    }

    getTestResultIdByRfid(rfid) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM TestResult WHERE rfid =?';
            this.db.get(sql, [rfid], (err, row) => {
                if (err) {
                    reject(err);
                    return "500";
                }
                if (!row) {
                    reject(err);
                    return;
                }
                resolve(row);
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
                'VALUES(?, ?, ?, ?);';
            this.db.run(sql, [
                nTR.idTestDescriptor,
                nTR.rfid,
                dayjs(nTR.Date).format("YYYY-MM-DD"),
                nTR.Result ? "true" : "false"
            ], (err) => {
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
                `rfid = ?`
                `Date = Date(?), ` +
                `Result = ? ` +
                `WHERE id = ?;`;
            this.db.run(sql, [
                nTR.newIdTestDescriptor,
                nTR.newRfid,
                nTR.newDate,
                nTR.newResult ? "true" : "false",
                id
            ], (err) => {
                if (err) {
                    reject(err);
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
                    return "404";
                }
                resolve(id);
            });
        });
    }
}

module.exports = TestResultRepository;

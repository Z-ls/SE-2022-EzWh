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
            const sql = 'CREATE TABLE IF NOT EXISTS TestResult(' +
                'id INTEGER PRIMARY KEY AUTOINCREMENT, ' +
                'idTestDescriptor INTEGER NOT NULL,' +
                'Date DATE NOT NULL, ' +
                'Result VARCHAR NOT NULL,' +
                'FOREIGN KEY(idTestDescriptor) REFERENCES TestDescriptor(id)' +
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
                if (err || rows.length === 0) {
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
            this.db.all(sql, [id], (err, rows) => {
                if (err || rows.length === 0) {
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
                'Date,' +
                'Result) ' +
                'VALUES(?, Date(?), ?);';
            this.db.run(sql, [
                nTR.idTestDescriptor,
                nTR.Date,
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
                `Date = Date(?), ` +
                `Result = ? ` +
                `WHERE id = ?;`;
            this.db.run(sql, [
                nTR.newIdTestDescriptor,
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
            this.db.run(sql, [id], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(id);
            });
        });
    }
}

module.exports = TestResultRepository;

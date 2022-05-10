class TestDescriptorRepository {

    sqlite = require('sqlite3');

    constructor() {
        this.db = new this.sqlite.Database("../ezwh.db", (err) => {
            if (err) throw err;
        });
        this.db.run("PRAGMA foreign_keys = ON");
    }

    dropTable() {
        return new Promise((resolve, reject) => {
            const sql = 'DROP TABLE IF EXISTS TestDescriptor';
            this.db.run(sql, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }

    newTestDescriptorTable() {
        return new Promise((resolve, reject) => {
            const sql = 'CREATE TABLE IF NOT EXISTS TestDescriptor(' +
                'id INTEGER PRIMARY KEY AUTOINCREMENT, ' +
                'name VARCHAR, ' +
                'procedureDescription VARCHAR, ' +
                'idSKU INTEGER,'+
                'FOREIGN KEY(idSKU) REFERENCES SKU(id));';
            this.db.run(sql, (err) => {
                if (err) {
                    reject(err);
                    return false;
                }
                resolve();
            });
        });
    }

    addTestDescriptor(td) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO TestDescriptor(' +
                'name, ' +
                'procedureDescription, ' +
                'idSKU) ' +
                'VALUES(?, ?, ?);';
            this.db.run(sql, [td.name, td.procedureDescription, td.idSKU], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(td.name);
            });
        });
    }

    updateTestDescriptor(td, id) {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE TestDescriptor SET ' +
                `name = ?, ` +
                `procedureDescription = ?, ` +
                `idSKU = ? ` +
                `WHERE id = ?;`;
            this.db.run(sql, [td.name, td.procedureDescription, td.idSKU, id], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(id);
            });
        });
    }

    getTestDescriptors() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM TestDescriptor';
            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                const tds = rows.map((td) => (
                    {
                        id: td.id,
                        name: td.name,
                        procedureDescription: td.procedureDescription,
                        idSKU: td.idSKU
                    }
                ));
                resolve(tds);
            });
        });
    }

    getTestDescriptor(id) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM TestDescriptor WHERE id = ?';
            this.db.run(sql, [id], (err, rows) => {
                if (err || !rows) {
                    reject(err);
                    return;
                }
                const tds = rows.map((td) => (
                    {
                        id: td.id,
                        name: td.name,
                        procedureDescription: td.procedureDescription,
                        idSKU: td.idSKU
                    }
                ));
                resolve(tds);
            });
        });
    }

    deleteTestDescriptor(id) {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM TestDescriptor WHERE id = ?';
            this.db.run(sql, [id], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(id);
            });
        });
    }

//     fake getSKU for debugging
    getSKUById(id) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM SKU WHERE id = ?';
            this.db.all(sql, [id], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(rows.pop());
            });
        })
    }

    getSKUItemByRfId(id) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM SKUItem WHERE rfid = ?';
            this.db.all(sql, [id], (err, rows) => {
                if (err || rows.length === 0) {
                    reject(err);
                    return;
                }
                resolve(rows);
            });
        })
    }

    getTestDescriptorIdBySKUId(skuId) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT id FROM TestDescriptor WHERE idSKU = ?";
            this.db.all(sql, [skuId], (err, rows) => {
               if (err) {
                reject(err);
                return;
               }
               resolve(rows.map(r => r.id));
            });
        });
    }
}

module.exports = TestDescriptorRepository;

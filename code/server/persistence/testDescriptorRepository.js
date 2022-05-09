class TestDescriptorRepository {

    sqlite = require('sqlite3');

    constructor() {
        this.db = new this.sqlite.Database("TestDescriptor.db", (err) => {
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
                'idSKU INTEGER, ' +
                'FOREIGN KEY(idSKU) REFERENCES SKU(id));';
            this.db.run(sql, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(true);
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
            this.db.run(sql, [
                td.name,
                td.procedureDescription,
                td.idSKU
            ], function (err) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
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
            this.db.run(sql, [
                td.newName,
                td.newProcedureDescription,
                td.newIdSKU,
                id
            ], function (err) {
                if (err) {
                    reject(err);
                    return;
                }
                // if (this.changes === 0) {
                //     return "404";
                // }
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
                resolve(rows);
            });
        });
    }

    getTestDescriptor(id) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM TestDescriptor WHERE id = ?';
            this.db.get(sql, [id], (err, row) => {
                if (err) {
                    reject(err);
                    return "500";
                }
                // if (!row) {
                //     return "404";
                // }
                resolve(row);
            });
        });
    }

    deleteTestDescriptor(id) {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM TestDescriptor WHERE id = ?';
            this.db.run(sql, [id], function (err) {
                if (err) {
                    reject(err);
                    return;
                }
                // if(this.changes === 0)
                //     return "404";
                resolve(true);
            });
        });
    }

//     fake getSKU for debugging
    getSKUById(id) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM SKU WHERE id = ?';
            this.db.run(sql, [id], (err, row) => {
                if (err) {
                    reject(err);
                    return "503";
                }
                if (row === null) {
                    return "404";
                }
                resolve(row);
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
               if (err || rows.length === 0) {
                   reject(err);
                   return;
               }
               resolve(rows);
            });
        });
    }
}

module.exports = TestDescriptorRepository;

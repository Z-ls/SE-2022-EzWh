class TestDescriptorRepository {

    sqlite = require('sqlite3');

    constructor() {
        this.db = new this.sqlite.Database("EzWh.db", (err) => {
            if (err) throw err;
        })
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
                'idSKU INTEGER);';
            this.db.run(sql, (err) => {
                if (err) {
                    reject(err);
                    return false;
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
            this.db.all(sql, [id], (err, rows) => {
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

    deleteTestDescriptor(id) {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM TestDescriptor WHERE id = ?';
            this.db.all(sql, [id], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(true);
            });
        });
    }
}

module.exports = TestDescriptorRepository;

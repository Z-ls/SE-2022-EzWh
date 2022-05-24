const sqlite = require("sqlite3");
const TestDescriptor = require("../model/TestDescriptor");

class TestDescriptorRepository {

    constructor() {
        this.db = new sqlite.Database("../ezwh.db", (err) => {
            if (err) throw err;
        });
        this.db.run("PRAGMA foreign_keys = ON");
    }

    dropTable() {
        return new Promise((resolve, reject) => {
            const sql = `DROP TABLE IF EXISTS TestDescriptor`;
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
            const sql = `CREATE TABLE IF NOT EXISTS TestDescriptor(` + `id INTEGER PRIMARY KEY AUTOINCREMENT, ` + `name VARCHAR NOT NULL, ` + `procedureDescription VARCHAR NOT NULL, ` + `idSKU INTEGER NOT NULL, ` + `FOREIGN KEY(idSKU) REFERENCES SKU(id) ON DELETE CASCADE` + `);`;
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
            const sql = `INSERT INTO TestDescriptor(` + `name, ` + `procedureDescription, ` + `idSKU) ` + `VALUES(?, ?, ?);`;
            this.db.run(sql, [td.name, td.procedureDescription, td.idSKU], function (err) {
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
            const sql = `UPDATE TestDescriptor SET ` + `name = ?, ` + `procedureDescription = ?, ` + `idSKU = ? ` + `WHERE id = ?;`;
            this.db.run(sql, [td.newName, td.newProcedureDescription, td.newIdSKU, id], function (err) {
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

    getTestDescriptors() {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM TestDescriptor`;
            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(rows.map(r => {
                    return new TestDescriptor(r.id, r.name, r.procedureDescription, r.idSKU);
                }));
            });
        });
    }

    getTestDescriptorById(id) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM TestDescriptor WHERE id = ?`;
            this.db.get(sql, [id], (err, row) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (!row) {
                    reject(404);
                    return;
                }
                resolve(new TestDescriptor(row.id, row.name, row.procedureDescription, row.idSKU));
            });
        });
    }

    getTestDescriptorIdsBySKUId(skuId) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT id FROM TestDescriptor WHERE idSKU = ?";
            this.db.all(sql, [skuId], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(rows);
            });
        });
    }

    deleteTestDescriptor(id) {
        return new Promise((resolve, reject) => {
            const sql = `DELETE FROM TestDescriptor WHERE id = ?`;
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

    deleteTestDescriptordata = () => {
        return new Promise((resolve, reject) => {
            const sql = `DELETE FROM TestDescriptor; DELETE FROM sqlite_sequence WHERE name = "TestDescriptor";`;
            this.db.run(sql, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(true);
            });
        });
    }

    repopulateDataBase = () => {
        return new Promise((resolve, reject) => {
            const sql =
                `
                INSERT INTO "SKU" VALUES (1,"description",2.0,3.0,"","",0,20.0);
                INSERT INTO "SKU" VALUES (2,"descpription2",3.0,3.0,"note1","800234543412",5,30.0);
                INSERT INTO "SKU" VALUES (3,"another description",50.0,3.0,"","900345654323",1,50.0);
                INSERT INTO "SKU" VALUES (4,"desc",33.0,40.0,"","900345654324",1,70.0);
                INSERT INTO "SKU" VALUES (5,"long descrption",3.0,3.0,"","900345654325",1,22.0);
                INSERT INTO "position" VALUES ("800234543412","8002","3454","3412",30.0,50.0,15.0,15.0);
                INSERT INTO "position" VALUES ("900345654323","9003","4565","4323",110.0,200.0,50.0,3.0);
                INSERT INTO "position" VALUES ("900345654324","9003","4565","4324",50.0,50.0,40.0,0.0);
                INSERT INTO "position" VALUES ("900345654325","9003","4565","4325",50.0,50.0,3.0,3.0);
                INSERT INTO "position" VALUES ("123456781234","1234","5678","1234",20.0,20.0,0.0,0.0);
                INSERT INTO "SKUITEM" VALUES ("12345678901234567890123456789014",1,1,"2021/11/29");
                INSERT INTO "SKUITEM" VALUES ("12345678901234567890123456789015",1,1,"2021/11/29");
                INSERT INTO "SKUITEM" VALUES ("12345678901234567890123456789016",2,1,"2021/11/29");
                INSERT INTO "SKUITEM" VALUES ("12345678901234567890123456789017",2,1,"2021/11/29");
                INSERT INTO "SKUITEM" VALUES ("12345678901234567890123456789018",3,1,"2021/11/29");
                INSERT INTO "SKUITEM" VALUES ("12345678901234567890123456789019",3,1,"2021/10/10");
                INSERT INTO "SKUITEM" VALUES ("12345678901234567890123456789020",4,1,"2021/01/01");
                INSERT INTO "SKUITEM" VALUES ("12345678901234567890123456789021",5,1,"2021/02/22");
                `;
            this.db.exec(sql, (err) => {
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

const sqlite = require("sqlite3");

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
                resolve(rows);
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
                resolve(row);
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
                if (rows.length === 0) {
                    reject(404);
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
                `DROP TABLE IF EXISTS "ITEM";
                CREATE TABLE IF NOT EXISTS "ITEM"(
                "id" INTEGER, 
                "description" VARCHAR, 
                "price" REAL,
                "SKUId" INTEGER,
                "supplierId" INTEGER,
                PRIMARY KEY("id","supplierId"),
                FOREIGN KEY("supplierId") REFERENCES "user"("id") ON DELETE CASCADE, 
                FOREIGN KEY("SKUId") REFERENCES "SKU"("id")
            );
            DROP TABLE IF EXISTS "internalTransaction";
            CREATE TABLE IF NOT EXISTS "internalTransaction" (
                "idInternalOrder"   INTEGER,
                "idSKU" InTEGER,
                "qty"   integer,
                FOREIGN KEY("idInternalOrder") REFERENCES "internalOrder"("idInternalOrder") ON DELETE CASCADE ON UPDATE CASCADE,
                FOREIGN KEY("idSKU") REFERENCES "SKU"("id") ON DELETE CASCADE ON UPDATE CASCADE,
                PRIMARY KEY("idInternalOrder","idSKU")
            );
            DROP TABLE IF EXISTS "TestDescriptor";
            CREATE TABLE IF NOT EXISTS "TestDescriptor" (
                "id"    INTEGER,
                "name"  VARCHAR,
                "procedureDescription"  VARCHAR,
                "idSKU" INTEGER,
                FOREIGN KEY("idSKU") REFERENCES "SKU"("id") ON DELETE CASCADE,
                PRIMARY KEY("id" AUTOINCREMENT)
            );
            DROP TABLE IF EXISTS "internalOrder";
            CREATE TABLE IF NOT EXISTS "internalOrder" (
                "idInternalOrder"   INTEGER,
                "issueDate" DATE NOT NULL,
                "customerId"    INTEGER NOT NULL,
                "state" TEXT NOT NULL,
                FOREIGN KEY("customerId") REFERENCES "user"("id") on delete cascade,
                PRIMARY KEY("idInternalOrder" AUTOINCREMENT)
            );
            DROP TABLE IF EXISTS "employee";
            CREATE TABLE IF NOT EXISTS "employee" (
                "idUser"    INTEGER,
                "salary"    REAL NOT NULL,
                FOREIGN KEY("idUser") REFERENCES "user" ON DELETE CASCADE
            );
            DROP TABLE IF EXISTS "restockTransaction";
            CREATE TABLE IF NOT EXISTS "restockTransaction" (
                "idRestockTransaction"  INTEGER,
                "quantity"  INTEGER NOT NULL DEFAULT 1,
                "idRestockOrder"    INTEGER,
                "idItem"    INTEGER,
                FOREIGN KEY("idRestockOrder") REFERENCES "restockOrder"("id") ON DELETE CASCADE,
                PRIMARY KEY("idRestockTransaction" AUTOINCREMENT)
            );
            DROP TABLE IF EXISTS "position";
            CREATE TABLE IF NOT EXISTS "position" (
                "positionID"    TEXT,
                "aisleID"   TEXT,
                "row"   TEXT,
                "col"   TEXT,
                "maxWeight" REAL,
                "maxVolume" REAL,
                "occupiedWeight"    REAL,
                "occupiedVolume"    REAL
            );
            DROP TABLE IF EXISTS "SKU";
            CREATE TABLE IF NOT EXISTS SKU(
                id INTEGER PRIMARY KEY AUTOINCREMENT, 
                description VARCHAR, 
                weight REAL, 
                volume REAL, 
                notes VARCHAR, 
                position VARCHAR, 
                availablequantity INTEGER, 
                price REAL
            );
            DROP TABLE IF EXISTS "SKUITEM";
            CREATE TABLE IF NOT EXISTS "SKUITEM" (
                "RFID"  VARCHAR,
                "SKUId" INTEGER,
                "Available" INTEGER,
                "DateOfStock"   DATE,
                PRIMARY KEY("RFID"),
                FOREIGN KEY("SKUId") REFERENCES "SKU"("id") ON DELETE CASCADE
            );
            DROP TABLE IF EXISTS "internalOrderTransactionRFID";
            CREATE TABLE IF NOT EXISTS "internalOrderTransactionRFID" (
                "IOid"  INTEGER NOT NULL,
                "RFID"  VARCHAR,
                FOREIGN KEY("IOid") REFERENCES "internalOrder"("idInternalOrder") on delete cascade,
                FOREIGN KEY("RFID") REFERENCES "SKUITEM"("RFID") ON DELETE CASCADE
            );
            DROP TABLE IF EXISTS "returnOrder";
            CREATE TABLE IF NOT EXISTS "returnOrder" (
                "id"    INTEGER,
                "returnDate"    DATE,
                "restockOrderId"    INT,
                PRIMARY KEY("id" AUTOINCREMENT),
                FOREIGN KEY("restockOrderId") REFERENCES "restockOrder"("id") ON DELETE CASCADE
            );
            DROP TABLE IF EXISTS "TestResult";
            CREATE TABLE IF NOT EXISTS "TestResult"( 
              "id" INTEGER PRIMARY KEY AUTOINCREMENT,  
              "idTestDescriptor" INTEGER NOT NULL,  
              "rfid" VARCHAR NOT NULL,  
              "Date" DATE NOT NULL,  
              "Result" VARCHAR NOT NULL, 
              FOREIGN KEY(idTestDescriptor) REFERENCES TestDescriptor(id), 
              FOREIGN KEY(rfid) REFERENCES SkuItem(RFID)
              );
            DROP TABLE IF EXISTS "user";
            CREATE TABLE IF NOT EXISTS "user" (
                "id"    integer,
                "username"  varchar,
                "name"  varchar,
                "surname"   varchar,
                "password"  varchar,
                "type"  varchar,
                PRIMARY KEY("id" AUTOINCREMENT)
            );
            DROP TABLE IF EXISTS "returnOrderTransaction";
            CREATE TABLE IF NOT EXISTS "returnOrderTransaction" (
                "idReturnOrder" integer,
                "RFID"  VARCHAR,
                FOREIGN KEY("idReturnOrder") REFERENCES "returnOrder"("id") ON DELETE CASCADE,
                FOREIGN KEY("RFID") REFERENCES "SKUITEM"("RFID") ON DELETE CASCADE ON UPDATE CASCADE,
                PRIMARY KEY("idReturnOrder","RFID")
            );
            DROP TABLE IF EXISTS "restockTransactionItem";
            CREATE TABLE IF NOT EXISTS "restockTransactionItem" (
                "quantity"  INTEGER NOT NULL DEFAULT 1,
                "idRestockOrder"    INTEGER NOT NULL,
                "idItem"    INTEGER,
                "supplierId" integer,
                FOREIGN KEY("idItem", "supplierId") REFERENCES "ITEM"("id", "supplierId") ON DELETE CASCADE,
                FOREIGN KEY("idRestockOrder") REFERENCES "restockOrder"("id") ON DELETE CASCADE
            );
            DROP TABLE IF EXISTS "restockTransactionSKU";
            CREATE TABLE IF NOT EXISTS "restockTransactionSKU" (
                "idRestockOrder"    INTEGER NOT NULL,
                "RFID"  VARCHAR NOT NULL,
                FOREIGN KEY("idRestockOrder") REFERENCES "restockOrder"("id") ON DELETE CASCADE,
                FOREIGN KEY("RFID") REFERENCES "SKUITEM"("RFID") ON DELETE CASCADE
            );
            DROP TABLE IF EXISTS "restockOrder";
            CREATE TABLE IF NOT EXISTS "restockOrder" (
                "id"    INTEGER,
                "issueDate" TEXT NOT NULL,
                "state" TEXT NOT NULL,
                "supplierId"    INTEGER,
                PRIMARY KEY("id" AUTOINCREMENT),
                FOREIGN KEY("supplierId") REFERENCES "user"("id") on delete cascade
            );
            DROP TABLE IF EXISTS "transportNote";
            CREATE TABLE IF NOT EXISTS "transportNote" (
                "idTransportNote"   INTEGER,
                "deliveryDate"  DATE NOT NULL,
                "ROid"  INTEGER NOT NULL,
                FOREIGN KEY("ROid") REFERENCES "restockOrder"("id") ON UPDATE CASCADE ON DELETE CASCADE,
                PRIMARY KEY("idTransportNote" AUTOINCREMENT)
            );
            
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

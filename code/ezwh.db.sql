BEGIN TRANSACTION;
DROP TABLE IF EXISTS "internalOrder";
CREATE TABLE IF NOT EXISTS "internalOrder" (
	"idInternalOrder"	INTEGER,
	"issueDate"	DATE NOT NULL,
	"customerId"	INTEGER NOT NULL,
	"state"	TEXT NOT NULL,
	FOREIGN KEY("customerId") REFERENCES "user"("id") on delete cascade,
	PRIMARY KEY("idInternalOrder" AUTOINCREMENT)
);
DROP TABLE IF EXISTS "restockTransaction";
CREATE TABLE IF NOT EXISTS "restockTransaction" (
	"idRestockTransaction"	INTEGER,
	"quantity"	INTEGER NOT NULL DEFAULT 1,
	"idRestockOrder"	INTEGER,
	"idItem"	INTEGER,
	FOREIGN KEY("idRestockOrder") REFERENCES "restockOrder"("id") ON DELETE CASCADE,
	PRIMARY KEY("idRestockTransaction" AUTOINCREMENT)
);
DROP TABLE IF EXISTS "position";
CREATE TABLE IF NOT EXISTS "position" (
	"positionID"	TEXT,
	"aisleID"	TEXT,
	"row"	TEXT,
	"col"	TEXT,
	"maxWeight"	REAL,
	"maxVolume"	REAL,
	"occupiedWeight"	REAL,
	"occupiedVolume"	REAL
);
DROP TABLE IF EXISTS "SKU";
CREATE TABLE IF NOT EXISTS "SKU"(
	"id" INTEGER PRIMARY KEY AUTOINCREMENT, 
	"description" VARCHAR, 
	"weight" REAL, 
	"volume" REAL, 
	"notes" VARCHAR, 
	"position" VARCHAR, 
	"availablequantity" INTEGER, 
	"price" REAL
);
DROP TABLE IF EXISTS "internalTransaction";
CREATE TABLE IF NOT EXISTS "internalTransaction" (
	"idInternalOrder"	INTEGER,
	"idSKU"	InTEGER,
	"qty"	integer,
	FOREIGN KEY("idInternalOrder") REFERENCES "internalOrder"("idInternalOrder") ON DELETE CASCADE ON UPDATE CASCADE,
	FOREIGN KEY("idSKU") REFERENCES "SKU"("id") ON DELETE CASCADE ON UPDATE CASCADE,
	PRIMARY KEY("idInternalOrder","idSKU")
);
DROP TABLE IF EXISTS "SKUITEM";
CREATE TABLE IF NOT EXISTS "SKUITEM" (
	"RFID"	VARCHAR,
	"SKUId"	INTEGER,
	"Available"	INTEGER,
	"DateOfStock"	DATE,
	PRIMARY KEY("RFID"),
	FOREIGN KEY("SKUId") REFERENCES "SKU"("id") ON DELETE CASCADE
);
DROP TABLE IF EXISTS "internalOrderTransactionRFID";
CREATE TABLE IF NOT EXISTS "internalOrderTransactionRFID" (
	"IOid"	INTEGER NOT NULL,
	"RFID"	VARCHAR,
	FOREIGN KEY("IOid") REFERENCES "internalOrder"("idInternalOrder") on delete cascade,
	FOREIGN KEY("RFID") REFERENCES "SKUITEM"("RFID") ON DELETE CASCADE
);
DROP TABLE IF EXISTS "TestDescriptor";
CREATE TABLE IF NOT EXISTS "TestDescriptor" (
	"id"	INTEGER,
	"name"	VARCHAR,
	"procedureDescription"	VARCHAR,
	"idSKU"	INTEGER,
	FOREIGN KEY("idSKU") REFERENCES "SKU"("id") ON DELETE CASCADE,
	PRIMARY KEY("id" AUTOINCREMENT)
);
DROP TABLE IF EXISTS "returnOrder";
CREATE TABLE IF NOT EXISTS "returnOrder" (
	"id"	INTEGER,
	"returnDate"	DATE,
	"restockOrderId"	INT,
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
  FOREIGN KEY(idTestDescriptor) REFERENCES TestDescriptor(id) on delete cascade, 
  FOREIGN KEY(rfid) REFERENCES SkuItem(RFID) on delete cascade
  );
DROP TABLE IF EXISTS "user";
CREATE TABLE IF NOT EXISTS "user" (
	"id"	integer,
	"username"	varchar,
	"name"	varchar,
	"surname"	varchar,
	"password"	varchar,
	"type"	varchar,
	PRIMARY KEY("id" AUTOINCREMENT)
);
DROP TABLE IF EXISTS "ITEM";
CREATE TABLE IF NOT EXISTS "ITEM"(
	"id" INTEGER, 
	"description" VARCHAR, 
	"price" REAL,
	"SKUId" INTEGER,
	"supplierId" INTEGER,
	PRIMARY KEY("id","supplierId"),
	FOREIGN KEY("supplierId") REFERENCES "user"("id") ON DELETE CASCADE, 
	FOREIGN KEY("SKUId") REFERENCES "SKU"("id") on delete cascade
);
DROP TABLE IF EXISTS "returnOrderTransaction";
CREATE TABLE IF NOT EXISTS "returnOrderTransaction" (
	"idReturnOrder"	integer,
	"RFID"	VARCHAR,
	FOREIGN KEY("idReturnOrder") REFERENCES "returnOrder"("id") ON DELETE CASCADE,
	FOREIGN KEY("RFID") REFERENCES "SKUITEM"("RFID") ON DELETE CASCADE ON UPDATE CASCADE,
	PRIMARY KEY("idReturnOrder","RFID")
);
DROP TABLE IF EXISTS "restockTransactionItem";
CREATE TABLE IF NOT EXISTS "restockTransactionItem" (
	"quantity"	INTEGER NOT NULL DEFAULT 1,
	"idRestockOrder"	INTEGER NOT NULL,
	"idItem"	INTEGER,
	"supplierId" integer,
	FOREIGN KEY("idItem", "supplierId") REFERENCES "ITEM"("id", "supplierId") ON DELETE CASCADE,
	FOREIGN KEY("idRestockOrder") REFERENCES "restockOrder"("id") ON DELETE CASCADE
);
DROP TABLE IF EXISTS "restockTransactionSKU";
CREATE TABLE IF NOT EXISTS "restockTransactionSKU" (
	"idRestockOrder"	INTEGER NOT NULL,
	"RFID"	VARCHAR NOT NULL,
	FOREIGN KEY("idRestockOrder") REFERENCES "restockOrder"("id") ON DELETE CASCADE,
	FOREIGN KEY("RFID") REFERENCES "SKUITEM"("RFID") ON DELETE CASCADE
);
DROP TABLE IF EXISTS "restockOrder";
CREATE TABLE IF NOT EXISTS "restockOrder" (
	"id"	INTEGER,
	"issueDate"	TEXT NOT NULL,
	"state"	TEXT NOT NULL,
	"supplierId"	INTEGER,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("supplierId") REFERENCES "user"("id") on delete cascade
);
DROP TABLE IF EXISTS "transportNote";
CREATE TABLE IF NOT EXISTS "transportNote" (
	"deliveryDate"	DATE NOT NULL,
	"ROid"	INTEGER NOT NULL,
	FOREIGN KEY("ROid") REFERENCES "restockOrder"("id") ON UPDATE CASCADE ON DELETE CASCADE,
	PRIMARY KEY("ROid")
);
COMMIT;

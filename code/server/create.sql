<!-- This goes between RO and Item
CREATE TABLE "restockTransaction" (
	"idRestockTransaction"	INTEGER,
	"quantity"	INTEGER NOT NULL DEFAULT 1,
	"idRestockOrder"	INTEGER,
	"idItem"	INTEGER,
	PRIMARY KEY("idRestockTransaction" AUTOINCREMENT)
);
CREATE TABLE "transportNote" (
	"idTransportNote"	INTEGER,
	"note"	TEXT NOT NULL,
	"ROid"	INTEGER NOT NULL,
	PRIMARY KEY("idTransportNote" AUTOINCREMENT)
);
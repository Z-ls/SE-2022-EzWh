BEGIN TRANSACTION;
INSERT INTO "SKU" VALUES (1,'description',2.0,3.0,'','',0,20.0);
INSERT INTO "SKU" VALUES (2,'descpription2',3.0,3.0,'note1','800234543412',5,30.0);
INSERT INTO "SKU" VALUES (3,'another description',50.0,3.0,'','900345654323',1,50.0);
INSERT INTO "SKU" VALUES (4,'desc',33.0,40.0,'','900345654324',1,70.0);
INSERT INTO "SKU" VALUES (5,'long descrption',3.0,3.0,'','900345654325',1,22.0);
INSERT INTO "position" VALUES ('800234543412','8002','3454','3412',30.0,50.0,15.0,15.0);
INSERT INTO "position" VALUES ('900345654323','9003','4565','4323',110.0,200.0,50.0,3.0);
INSERT INTO "position" VALUES ('900345654324','9003','4565','4324',50.0,50.0,40.0,0.0);
INSERT INTO "position" VALUES ('900345654325','9003','4565','4325',50.0,50.0,3.0,3.0);
INSERT INTO "position" VALUES ('123456781234','1234','5678','1234',20.0,20.0,0.0,0.0);
INSERT INTO "SKUITEM" VALUES ('43094132908230948',2,1,'2021/11/29');
INSERT INTO "SKUITEM" VALUES ('490328402398423098',2,1,'2021/11/29');
INSERT INTO "SKUITEM" VALUES ('403589231239487123',2,1,'2021/11/29');
INSERT INTO "SKUITEM" VALUES ('342985734905872345',2,1,'2021/11/29');
INSERT INTO "SKUITEM" VALUES ('394857431205987345',2,1,'2021/11/29');
INSERT INTO "SKUITEM" VALUES ('190857435904875092',3,1,'2021/10/10');
INSERT INTO "SKUITEM" VALUES ('503498534095834509',4,1,'2021/01/01');
INSERT INTO "SKUITEM" VALUES ('210498234098232344',5,1,'2021/02/22');
COMMIT;

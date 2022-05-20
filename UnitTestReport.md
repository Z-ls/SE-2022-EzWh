# Unit Testing Report

Date: 19/05/72022

Version: 1.0

# Contents

- [Black Box Unit Tests](#black-box-unit-tests)




- [White Box Unit Tests](#white-box-unit-tests)


# Black Box Unit Tests

    <Define here criteria, predicates and the combination of predicates for each function of each class.
    Define test cases to cover all equivalence classes and boundary conditions.
    In the table, report the description of the black box test case and (traceability) the correspondence with the Jest test case writing the 
    class and method name that contains the test case>
    <Jest tests  must be in code/server/unit_test  >

 ### **Class *skuRepository* - method *editSKU(sku,id)***



**Criteria for method *editSKU(sku,id)*:**
	

 - id already exists in DB

**Predicates for method *editSKU(sku,id)*:**

| Criteria                | Predicate |
| ----------------------- | --------- |
| id already exists in DB | true      |
|                         | false     |





**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |
|          |                 |
|          |                 |



**Combination of predicates**:


| id already exists in DB | Valid / Invalid | Description of the test case                                 | Jest test case |
| ----------------------- | --------------- | ------------------------------------------------------------ | -------------- |
| false                   | Invalid         | SKURepository skuRep = new SKURepository();<br />SKU s1 = new SKU("a new sku",100,50,"first sku",10.99,50);<br />SKU s2 = new SKU("a new sku 2",100,60,"first sku",10.99,50);<br />skuRep.addSKU(s1);<br />skuRep.edit(s2,3) -> returns false<br />skuRep.getSKUById(3)-> returns [ ] |                |
| true                    | Valid           | SKURepository skuRep = new SKURepository();<br />SKU s1 = new SKU("a new sku",100,50,"first sku",10.99,50);<br />SKU s2 = new SKU("a new sku 2",100,60,"first sku",10.99,50);<br />skuRep.addSKU(s1);<br />skuRep.edit(s2,1) -> returns true<br />skuRep.getSKUById(1)-> returns s1 |                |

 ### **Class *skuRepository* - method *editSKUPosition(sku,id)***



**Criteria for method *editSKUPosition(position,id)*:**
	

 - id already exists in DB

**Predicates for method *editSKUPosition(position,id)*:**

| Criteria                | Predicate |
| ----------------------- | --------- |
| id already exists in DB | true      |
|                         | false     |





**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |
|          |                 |
|          |                 |



**Combination of predicates**:


| id already exists in DB | Valid / Invalid | Description of the test case                                 | Jest test case |
| ----------------------- | --------------- | ------------------------------------------------------------ | -------------- |
| false                   | Invalid         | SKURepository skuRep = new SKURepository();<br />SKU s1 = new SKU("a new sku",100,50,"first sku",10.99,50);<br />SKU s2 = new SKU("a new sku 2",100,60,"first sku",10.99,50);<br />skuRep.addSKU(s1);<br />skuRep.edit(s2,3) -> returns false<br />skuRep.getSKUById(3)-> returns [ ] |                |
| true                    | Valid           | SKURepository skuRep = new SKURepository();<br />SKU s1 = new SKU("a new sku",100,50,"first sku",10.99,50);<br />SKU s2 = new SKU("a new sku 2",100,60,"first sku",10.99,50);<br />skuRep.addSKU(s1);<br />skuRep.edit(s2,1) -> returns true<br />skuRep.getSKUById(1)-> returns s1 |                |

 ### **Class *skuController* - method *editSKU(newSku,id)***



**Criteria for method *editSKU(newSku,id):**
	

 - id already exists in DB
 - sku has a position assigned
 - newSku.newWeight * newAvailabiltyQuantity
 - newSku.newVolume * newAvailabilityQuantity

**Predicates for method *editSKU(newSku,id)*:**

| Criteria                                          | Predicate                |
| ------------------------------------------------- | ------------------------ |
| id already exists in DB                           | true                     |
|                                                   | false                    |
| sku has a position assigned                       | true                     |
|                                                   | false                    |
| newSku.newWeight * newSku.newAvailabiltyQuantity  | < sku.position.maxWeight |
|                                                   | >sku.position.maxWeight  |
| newSku.newVolume * newSku.newAvailabilityQuantity | < sku.position.maxVolume |
|                                                   | >sku.position.maxVolume  |





**Boundaries**:

| Criteria                                          | Boundary values          |
| ------------------------------------------------- | ------------------------ |
| newSku.newWeight * newSku.newAvailabiltyQuantity  | = sku.position.maxWeight |
| newSku.newVolume * newSku.newAvailabilityQuantity | = sku.position.maxVolume |



**Combination of predicates**:


| id already exists in DB | sku has a position assigned | sku newWeight * newAvailabiltyQuantity | sku newVolume * newAvailabilityQuantity | Valid / Invalid | Description of the test case                                 | Jest test case |
| ----------------------- | --------------------------- | -------------------------------------- | --------------------------------------- | --------------- | ------------------------------------------------------------ | -------------- |
| false                   | -                           | -                                      | -                                       | Invalid         | SKURepository skuRep = new SKURepository()<br />SKU s1 = new SKU("a new sku",100,50,"first sku",10.99,50);<br />SKUController skuController= new skuController()<br />SKU s2 = new SKU("a new sku 2",100,60,"first sku",10.99,50);<br />skuRep.addSKU(s1);<br />skuController.editSKU(s2,3) -> returns 404<br />skuRep.getSKUById(3)-> [] |                |
| true                    | false                       | -                                      | -                                       | Valid           | SKURepository skuRep = new SKURepository()<br />SKU s1 = new SKU("a new sku",100,50,"first sku",10.99,50);<br />SKUController skuController= new skuController()<br />SKU s2 = new SKU("a new sku 2",100,60,"first sku",10.99,50);<br />skuRep.addSKU(s1);<br />skuController.editSKU(s2,1) -> returns 200<br />skuRep.getSKUById(1)-> [{"a new sku 2",100,60,"first sku",10.99,50}] |                |
| true                    | true                        | >sku.position.maxWeight                | >sku.position.maxVolume                 | Invalid         | SKURepository skuRep = new SKURepository()<br />PositionRepository posRepo = new PositionRepository();<br />SKUController skuController= new skuController()<br />PositionRepository posRepo = new PositionRepository();<br />Position pos = new Position("800234543412","8002","3454","3412",200,200)<br />SKU s1 = new SKU("a new sku",2,3,"first sku",10.99,50);<br />SKU s2 = new SKU("a new sku 2",100,60,"first sku",10.99,50);<br />skuRep.addSKU(s1);<br />posRepo.addPos(pos);<br />sku.editSKUPosition(pos,1)<br />skuController.editSKU(s2,1) -> returns 422<br />skuRep.getSKUById(1) -> {"a new sku",2,3,"first sku",10.99,50,"800234543412"} |                |
| true                    | true                        | <=sku.position.maxWeight               | <=sku.position.maxVolume                | Valid           | SKURepository skuRep = new SKURepository()<br />PositionRepository posRepo = new PositionRepository();<br />SKUController skuController= new skuController()<br />Position pos = new Position("800234543412","8002","3454","3412",1000,1000)<br />SKU s1 = new SKU("a new sku",2,3,"first sku",10.99,50);<br />SKU s2 = new SKU("a new sku 2",100,60,"first sku",10.99,50);<br />skuRep.addSKU(s1);<br />posRepo.addPos(pos);<br />sku.editSKUPosition(pos,1)<br />skuController.editSKU(s2,1) -> returns 200<br />skuRep.getSKUById(1) -> {"a new sku 2",100,60,"first sku",10.99,50,"800234543412"} |                |

 ### **Class *skuController* - method *editSKUPosition(position,id)***



**Criteria for method *editSKUPosition(position,id)*:**
	

 - id already exists in DB
 - position already exists in DB
 - sku has already the new position
 - sku.Weight * sku.AvailabiltyQuantity
 - sku.Volume * sku.AvailabilityQuantity

**Predicates for method *editSKUPosition(position,id)*:**

| Criteria                              | Predicate            |
| ------------------------------------- | -------------------- |
| id already exists in DB               | true                 |
|                                       | false                |
| position already exists in DB         | true                 |
|                                       | false                |
| sku has already the new position      | true                 |
|                                       | false                |
| sku.Weight * sku.AvailabiltyQuantity  | < position.maxWeight |
|                                       | >position.maxWeight  |
| sku.Volume * sku.AvailabilityQuantity | < position.maxVolume |
|                                       | >position.maxVolume  |





**Boundaries**:

| Criteria                              | Boundary values      |
| ------------------------------------- | -------------------- |
| sku.Weight * sku.AvailabiltyQuantity  | = position.maxWeight |
| sku.Volume * sku.AvailabilityQuantity | = position.maxVolume |



**Combination of predicates**:


| id already exists in DB | position already exists in DB | sku has already the new position | sku.Weight * sku.AvailabiltyQuantity | sku.Volume * sku.AvailabilityQuantity | Valid / Invalid | Description of the test case                                 | Jest test case |
| ----------------------- | ----------------------------- | -------------------------------- | ------------------------------------ | ------------------------------------- | --------------- | ------------------------------------------------------------ | -------------- |
| false                   | -                             |                                  | -                                    | -                                     | Invalid         | SKURepository skuRep = new SKURepository()<br />SKUController skuController= new skuController()<br />PositionRepository posRepo = new PositionRepository();<br />Position pos = new Position("800234543412","8002","3454","3412",1000,1000)<br />SKU s1 = new SKU("a new sku",100,50,"first sku",10.99,50);<br />skuRep.addSKU(s1);<br />skuController.editSKUPosition(pos,3) ) -> returns 404<br />skuRep.getSKUById(3)-> [] |                |
| true                    | false                         | -                                | -                                    | -                                     | Invalid         | SKURepository skuRep = new SKURepository()<br />SKUController skuController= new skuController()<br />PositionRepository posRepo = new PositionRepository();<br />Position pos = new Position("800234543412","8002","3454","3412",1000,1000)<br />SKU s1 = new SKU("a new sku",100,50,"first sku",10.99,50);<br />skuRep.addSKU(s1);<br />skuController.editSKUPosition(pos,1) ) -> returns 404<br />skuRep.getSKUById(1)-> s1 |                |
| true                    | true                          | true                             | -                                    | -                                     | Invalid         | SKURepository skuRep = new SKURepository()<br />SKUController skuController= new skuController()<br />PositionRepository posRepo = new PositionRepository();<br />Position pos = new Position("800234543412","8002","3454","3412",1000,1000)<br />posRepo.addPos(pos);<br />SKU s1 = new SKU("a new sku",100,50,"first sku",10.99,50);<br />skuRep.addSKU(s1);<br />skuController.editSKUPosition(pos,1) ) -> 202<br />skuController.editSKUPosition(pos,1) ) -> 422<br />skuRep.getSKUById(1)-> [{"a new sku",100,50,"first sku",10.99,50,"800234543412"}] |                |
| true                    | true                          | false                            | > position.maxWeight                 | > position.maxVolume                  | Invalid         | SKURepository skuRep = new SKURepository()<br />SKUController skuController= new skuController()<br />PositionRepository posRepo = new PositionRepository();<br />Position pos = new Position("800234543412","8002","3454","3412",200,200)<br />posRepo.addPos(pos);<br />SKU s1 = new SKU("a new sku",100,50,"first sku",10.99,50);<br />skuRep.addSKU(s1);<br />skuController.editSKUPosition(pos,1) ) -> 422<br />skuRep.getSKUById(1)-> s1 |                |
| true                    | true                          | false                            | <= position.maxWeight                | <= position.maxVolume                 | Valid           | SKURepository skuRep = new SKURepository()<br />SKUController skuController= new skuController()<br />PositionRepository posRepo = new PositionRepository();<br />Position pos = new Position("800234543412","8002","3454","3412",1000,1000)<br />posRepo.addPos(pos);<br />SKU s1 = new SKU("a new sku",100,50,"first sku",10.99,50);<br />skuRep.addSKU(s1);<br />skuController.editSKUPosition(pos,1) ) -> 202<br />skuRep.getSKUById(1)-> [{"a new sku",100,50,"first sku",10.99,50,"800234543412}] |                |

 ### **Class *skuItemRepository* - method *addSKUItem(skuItem)***



**Criteria for method *addSKUItem(skuItem)*:**
	

 - RFID already exists in DB
 - skuId exists in DB

**Predicates for method *addSKUItem(skuItem)*:**

| Criteria                  | Predicate |
| ------------------------- | --------- |
| RFID already exists in DB | true      |
|                           | false     |
| skuId exists in DB        | true      |
|                           | false     |





**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |
|          |                 |
|          |                 |



**Combination of predicates**:


| RFID already exists in DB | skuId exists in DB | Valid / Invalid | Description of the test case                                 | Jest test case |
| ------------------------- | ------------------ | --------------- | ------------------------------------------------------------ | -------------- |
| true                      | -                  | Invalid         | SKUItemRepository skuItemRep = new SKUItemRepository();<br />SKUItem si1 = new SKUItem("12345678901234567890123456789015",1,"2021/11/29 12:30");<br />skuItemRep.addSKUItem(si1) -> returns true;<br />skuItemRep.addSKUItem(si1) -> returns false;<br />skuItemRep.getSingleSKUItem(12345678901234567890123456789015)-> returns si1 |                |
| false                     | false              | Invalid         | SKUItemRepository skuItemRep = new SKUItemRepository();<br />SKUItem si1 = new SKUItem("12345678901234567890123456789015",1,"2021/11/29 12:30");<br />skuItemRep.addSKUItem(si1) -> returns false;<br />skuItemRep.getSingleSKUItem(12345678901234567890123456789015)-> returns [] |                |
| false                     | true               | Valid           | SKUItemRepository skuItemRep = new SKUItemRepository();<br />SKURepository skuRep = new SKURepository();<br />SKU s1 = new SKU("a new sku",100,50,"first sku",10.99,50);<br />skuItemRep.addSKU(s1)<br />SKUItem si1 = new SKUItem("12345678901234567890123456789015",1,"2021/11/29 12:30");<br />skuItemRep.addSKUItem(si1) -> returns true;<br />skuItemRep.getSingleSKUItem(12345678901234567890123456789015)-> returns si1 |                |

 ### **Class *skuItemRepository* - method *deleteSKUItem(rfid)***



**Criteria for method *deleteSKUItem(rfid)*:**
	

 - RFID exists in DB

**Predicates for method *deleteSKUItem(rfid)*:**

| Criteria          | Predicate |
| ----------------- | --------- |
| RFID exists in DB | true      |
|                   | false     |





**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |
|          |                 |
|          |                 |



**Combination of predicates**:


| RFID already exists in DB | Valid / Invalid | Description of the test case                                 | Jest test case |
| ------------------------- | --------------- | ------------------------------------------------------------ | -------------- |
| false                     | Invalid         | SKUItemRepository skuItemRep = new SKUItemRepository();<br />SKUItem si1 = new SKUItem("12345678901234567890123456789015",1,"2021/11/29 12:30");<br />skuItemRep.deleteSKUItem(si1); -> returns false<br />skuItemRep.getSingleSKUItem(12345678901234567890123456789015)-> returns [] |                |
| true                      | Valid           | SKUItemRepository skuItemRep = new SKUItemRepository();<br />SKURepository skuRep = new SKURepository();<br />SKU s1 = new SKU("a new sku",100,50,"first sku",10.99,50);<br />skuItemRep.addSKU(s1)<br />SKUItem si1 = new SKUItem("12345678901234567890123456789015",1,"2021/11/29 12:30");<br />skuItemRep.addSKUItem(si1);<br />skuItemRep.deleteSKUItem(si1); -> returns true<br />skuItemRep.getSingleSKUItem(12345678901234567890123456789015)-> returns [] |                |

 ### **Class *skuItemController* - method *editSKUItem(newSKUItem,rfid)***



**Criteria for method *editSKUItem(newSKUItem,rfid)*:**
	

 - RFID exists in DB

**Predicates for method *editSKUItem(newSKUItem,rfid)*:**

| Criteria          | Predicate |
| ----------------- | --------- |
| RFID exists in DB | true      |
|                   | false     |





**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |
|          |                 |
|          |                 |



**Combination of predicates**:


| RFID already exists in DB | Valid / Invalid | Description of the test case                                 | Jest test case |
| ------------------------- | --------------- | ------------------------------------------------------------ | -------------- |
| false                     | Invalid         | SKUItemRepository skuItemRep = new SKUItemRepository();<br />SKUItemController skuItemController = new SKUItemController();<br />SKUItem si1 = new SKUItem("12345678901234567890123456789015",1,"2021/11/29 12:30");<br />SKUItem si2 = new SKUItem("12345678901234567890123456789015","2021/11/29 13:30");<br />skuItemController.editSKUItem(si2,12345678901234567890123456789015); -> returns false<br />skuItemRep.getSingleSKUItem(12345678901234567890123456789015)-> returns [] |                |
| true                      | Valid           | SKUItemRepository skuItemRep = new SKUItemRepository();<br />SKUItemController skuItemController = new SKUItemController();<br />SKUItem si1 = new SKUItem("12345678901234567890123456789015",1,"2021/11/29 12:30");<br />skuItemRep.addSKUItem(si1)<br />SKUItem si2 = new SKUItem("12345678901234567890123456789015","2021/11/29 13:30");<br />skuItemController.editSKUItem(si2,12345678901234567890123456789015); -> returns true<br />skuItemRep.getSingleSKUItem(12345678901234567890123456789015)-> returns [{"12345678901234567890123456789015",1,0,"2021/11/29 13:30"}] |                |

 ### **Class *ItemRepository* - method *addItem(item)***



**Criteria for method *addItem(item)*:**
	

 - id already exists in DB
 - supplierid already exists in DB
 - skuId exists in DB

**Predicates for method *addItem(item)*:**

| Criteria                        | Predicate |
| ------------------------------- | --------- |
| id already exists in DB         | true      |
|                                 | false     |
| supplierid already exists in DB | true      |
|                                 | false     |
| skuId exists in DB              | true      |
|                                 | false     |





**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |
|          |                 |
|          |                 |



**Combination of predicates**:


| id already exists in DB | supplierid already exists in DB | skuId exists in DB | Valid / Invalid | Description of the test case                                 | Jest test case |
| ----------------------- | ------------------------------- | ------------------ | --------------- | ------------------------------------------------------------ | -------------- |
| true                    | true                            | -                  | Invalid         | ItemRepository ItemRep = new ItemRepository();<br />//Supplier with supplierid=2 exists in DB<br />Item i1 = new Item(12,"a new item", 10.99, 1, 2);<br />ItemRep.addItem(i1) -> returns true;<br />ItemRep.addItem(i1) -> returns false;<br />skuItemRep.getSingleItem(12)-> returns i1 |                |
| true                    | false                           | -                  | Invalid         | ItemRepository ItemRep = new ItemRepository();<br />Item i1 = new Item(12,"a new item", 10.99, 1, 2);<br />ItemRep.addItem(i1) -> returns false;<br />skuItemRep.getSingleItem(12)-> returns[] |                |
| false                   | true                            | false              | Invalid         | ItemRepository ItemRep = new ItemRepository();<br />//Supplier with supplierid=2 exists in DB<br />Item i1 = new Item(12,"a new item", 10.99, 1, 2);<br />ItemRep.addItem(i1) -> returns false;<br />IskuItemRep.getSingleItem(12)-> returns [] |                |
| false                   | true                            | true               | Valid           | ItemRepository ItemRep = new ItemRepository();<br />//Supplier with supplierid=2 exists in DB<br />//SKU with skuid=1 exists in DB<br />Item i1 = new Item(12,"a new item", 10.99, 1, 2);<br />ItemRep.addItem(i1) -> returns true;<br />IskuItemRep.getSingleItem(12)-> returns i1 |                |

 ### **Class *ItemRepository* - method *deleteItem(id)***



**Criteria for method *deleteItem(id)*:**
	

 - id exists in DB

**Predicates for method *deleteItem(id)*:**

| Criteria        | Predicate |
| --------------- | --------- |
| id exists in DB | true      |
|                 | false     |





**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |
|          |                 |
|          |                 |



**Combination of predicates**:


| id exists in DB | Valid / Invalid | Description of the test case                                 | Jest test case |
| --------------- | --------------- | ------------------------------------------------------------ | -------------- |
| false           | Invalid         | ItemRepository ItemRep = new ItemRepository();<br />//Supplier with supplierid=2 exists in DB<br />//SKU with skuid=1 exists in DB<br />Item i1 = new Item(12,"a new item", 10.99, 1, 2);<br />ItemRep.deleteItem(12) -> returns false;<br />skuItemRep.getSingleItem(12)-> returns [] |                |
| true            | Valid           | ItemRepository ItemRep = new ItemRepository();<br />//Supplier with supplierid=2 exists in DB<br />//SKU with skuid=1 exists in DB<br />Item i1 = new Item(12,"a new item", 10.99, 1, 2);<br />ItemRep.addItem(i1) -> returns true;<br />ItemRep.deleteItem(12) -> returns true;<br />skuItemRep.getSingleItem(12)-> returns[] |                |

 ### **Class *skuItemController* - method *editSKUItem(newItem,id)***



**Criteria for method *editSKUItem(newItem,id)*:**
	

 - idexists in DB

**Predicates for method *editSKUItem(newItem,id)*:**

| Criteria        | Predicate |
| --------------- | --------- |
| id exists in DB | true      |
|                 | false     |





**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |
|          |                 |
|          |                 |



**Combination of predicates**:


| RFID already exists in DB | Valid / Invalid | Description of the test case                                 | Jest test case |
| ------------------------- | --------------- | ------------------------------------------------------------ | -------------- |
| false                     | Invalid         | ItemRepository itemRep = new ItemRepository();<br />ItemController itemController = new ItemController();<br />//Supplier with supplierid=2 exists in DB<br />//SKU with skuid=1 exists in DB<br />Item i1 = new Item(12,"a new item", 10.99, 1, 2);<br />Item i2 = new Item("a new item2",11.99);<br />itemController.editSKUItem(i2,12); -> returns false<br />itemRep.getSingleSKUItem(12)-> returns [] |                |
| true                      | Valid           | ItemRepository itemRep = new ItemRepository();<br />ItemController itemController = new ItemController();<br />//Supplier with supplierid=2 exists in DB<br />//SKU with skuid=1 exists in DB<br />Item i1 = new Item(12,"a new item", 10.99, 1, 2);<br />itemRep.addItem(i1)<br />Item i2 = new Item("a new item2",11.99);<br />itemController.editSKUItem(i2,12); -> returns true<br />itemRep.getSingleSKUItem(12)-> returns {12,"a new item", 11.99, 1, 2} |                |

# White Box Unit Tests

### Test cases definition


    <Report here all the created Jest test cases, and the units/classes under test >
    <For traceability write the class and method name that contains the test case>


| Unit name | Jest test case |
| --------- | -------------- |
|           |                |
|           |                |
|           |                |

### Code coverage report

    <Add here the screenshot report of the statement and branch coverage obtained using
    the coverage tool. >


### Loop coverage analysis

    <Identify significant loops in the units and reports the test cases
    developed to cover zero, one or multiple iterations >

| Unit name | Loop rows | Number of iterations | Jest test case |
| --------- | --------- | -------------------- | -------------- |
|           |           |                      |                |
|           |           |                      |                |
|           |           |                      |                |




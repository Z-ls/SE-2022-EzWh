# Integration and API Test Report

Date: 23/05/2022

Version: 1.0

# Contents

- [Dependency graph](#dependency graph)

- [Integration approach](#integration)

- [Tests](#tests)

- [Scenarios](#scenarios)

- [Coverage of scenarios and FR](#scenario-coverage)
- [Coverage of non-functional requirements](#nfr-coverage)



# Dependency graph 

```plantuml
@startuml
entity internalOrder 
@enduml 
```

# Integration approach

    The integration sequence adopted is Bottom Up.



#  Integration Tests

   <define below a table for each integration step. For each integration step report the group of classes under test, and the names of
     Jest test cases applied to them, and the mock ups used, if any> Jest test cases should be here code/server/unit_test

## Step 1
| Classes  | mock up used |Jest test cases |
|--|--|--|
|SKURepository|-|testEditSKU(newSKU, id, expected), testEditSKUPosition(position, id, expected)|
|SKUItemRepository|-|testAddSKUItem(newSKUItem,expected),testDeleteSKUItem(rfid,expected)|
|ItemRepository|-|testAddItem(newitem,expected), testDeleteitem(id,expected)|


## Step 2
| Classes  | mock up used |Jest test cases |
|--|--|--|
|SKUController|-|testEditSKUController(newSKU, id, expected), testEditSKUPositionController(position, id, expected)|
|SKUItemController|-|testEditSKUItem(newSKUItem,rfid,expected)|
|ItemController|-|testEditItem(newItem,id,expected)|


## Step 3 


| Classes  | mock up used |Mocha test cases |
|--|--|--|
|router/SKU|-|addSKU(expectedHTTPStatus, newSKU)<br/>getSingleSKU(expectedHTTPStatus, expectedBody, id)<br/>getSKUs(expectedHTTPStatus, expectedBody)<br/>editSKU(expectedHTTPStatus, id, newSKU)<br/>editSKUPosition(expectedHTTPStatus, id, position)<br/>deleteSKU(expectedHTTPStatus, id)|
|router/SKUItem|-|addSKUItem(expectedHTTPStatus, newSKUItem) <br/>getSKUItemByRFID(expectedHTTPStatus, expectedBody, rfid)<br/>getSKUItemBySKUId(expectedHTTPStatus, expectedBody, id)<br/>getSKUItems(expectedHTTPStatus, expectedBody)<br/>editSKUItem(expectedHTTPStatus, rfid, newSKUItem)<br/>deleteSKUItem(expectedHTTPStatus, rfid)|
|router/Item|-|addItem(expectedHTTPStatus, newItem)<br/>getItemById(expectedHTTPStatus, expectedBody, id)<br/>getItems(expectedHTTPStatus, expectedBody)<br/>editItem(expectedHTTPStatus, id, newItem)<br/>deleteSKU(expectedHTTPStatus, id)|




# API testing - Scenarios


<If needed, define here additional scenarios for the application. Scenarios should be named
 referring the UC in the OfficialRequirements that they detail>

## Scenario UC1.4

| Scenario |  name |
| ------------- |:-------------:|
|  Precondition     | Manager M exists and is logged in |
|  Post condition     | S  out the system |
| Step#        | Description  |
|  1     | M selects SKU to delete |
|  2     | M confirms the SKU selected |

## Scenario UC1.5

| Scenario       |               name                |
| -------------- | :-------------------------------: |
| Precondition   | Manager M exists and is logged in |
| Post condition |      List of S are displayed      |
| Step#          |            Description            |
| 1              |      M selects list of SKUs       |
| 2              |     System show list of SKUs      |

## Scenario UC1.6

| Scenario       |               name                |
| -------------- | :-------------------------------: |
| Precondition   | Manager M exists and is logged in |
| Post condition |      S selected is displayed      |
| Step#          |            Description            |
| 1              |       M send Id of the SKU        |
| 2              |    System display SKU selected    |



## Scenario UC12.6

| Scenario       |               name                |
| -------------- | :-------------------------------: |
| Precondition   | Manager M exists and is logged in |
| Post condition |        SI is out of system        |
| Step#          |            Description            |
| 1              |    M selects SI to be deleted     |
| 2              |    M confirms the SI selected     |



# Coverage of Scenarios and FR


<Report in the following table the coverage of  scenarios (from official requirements and from above) vs FR. 
Report also for each of the scenarios the (one or more) API Mocha tests that cover it. >  Mocha test cases should be here code/server/test




| Scenario ID | Functional Requirements covered | Mocha  Test(s) |
| ----------- | ------------------------------- | ----------- |
| Scenario 1-1<br />Scenario 1-2<br />Scenario 1-3 | FR2 Manage SKU               | addSKU(expectedHTTPStatus, newSKU)<br/>getSingleSKU(expectedHTTPStatus, expectedBody, id)<br/>getSKUs(expectedHTTPStatus, expectedBody)<br/>editSKU(expectedHTTPStatus, id, newSKU)<br/>editSKUPosition(expectedHTTPStatus, id, position)<br/>deleteSKU(expectedHTTPStatus, id) |
| Scenario 1-1<br />Scenario 1-2<br />Scenario 1-3 | FR2.1 Define a new SKU, or modify an existing SKU | addSKU(expectedHTTPStatus, newSKU)<br/>editSKU(expectedHTTPStatus, id, newSKU)<br/>editSKUPosition(expectedHTTPStatus, id, position) |
| Scenario 1-4 | FR2.2 Delete a SKU | deleteSKU(expectedHTTPStatus, id) |
| Scenario 1-5 | FR2.3 List all SKUs | getSKUs(expectedHTTPStatus, expectedBody) |
| Scenario 1-6 | FR2.4 Search a SKU (by ID) | getSingleSKU(expectedHTTPStatus, expectedBody, id) |
| Scenario 5-3-1<br />Scenario 5-3-3 | FR5.8.3 Store a SKU Item | addSKUItem(expectedHTTPStatus, newSKUItem) <br/> |
| Scenario 5-2-1<br />Scenario 5-2-2<br />Scenario 5-2-3 | FR6.9 Select SKU Item with a FIFO criterion | getSKUItemByRFID(expectedHTTPStatus, expectedBody, rfid)<br/>getSKUItemBySKUId(expectedHTTPStatus, expectedBody, id)<br/>getSKUItems(expectedHTTPStatus, expectedBody)<br/> |
| Scenario 12-1 | FR6.10 Remove SKU Item from warehouse | deleteSKUItem(expectedHTTPStatus, rfid) |
| Scenario 11-1<br />Scenario 11-2 | FR7 Manage Items | addItem(expectedHTTPStatus, newItem)<br/>editItem(expectedHTTPStatus, id, newItem) |



# Coverage of Non Functional Requirements


<Report in the following table the coverage of the Non Functional Requirements of the application - only those that can be tested with automated testing frameworks.>


### 

| Non Functional Requirement | Test name                                                    |
| -------------------------- | ------------------------------------------------------------ |
| NFR9                       | addSKUItem(expectedHTTPStatus, newSKUItem) <br/>editSKUItem(expectedHTTPStatus, rfid, newSKUItem)<br/> |
| NFR6                       | addSKUItem(expectedHTTPStatus, newSKUItem) <br/>getSKUItemByRFID(expectedHTTPStatus, expectedBody, rfid)<br/>editSKUItem(expectedHTTPStatus, rfid, newSKUItem)<br/>deleteSKUItem(expectedHTTPStatus, rfid) |


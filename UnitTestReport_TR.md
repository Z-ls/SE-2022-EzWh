 ### **Class *TestResult* - method *updateTestResult***



**Criteria for method *updateTestResult*:**

 - **ID** has to be an **integer** 
 - **ID** has to be **bigger than 0**
 - **newIdTestDescriptor** has to be an **integer** 
 - **newIdTestDescriptor** has to be **bigger than 0**
 - **newDate** has to be a **non-empty** string
 - **newResult** has to be a **non-empty** string



**Predicates for method *updateTestResult*:**

| Criteria                                     | Predicate                                |
|----------------------------------------------|------------------------------------------|
| ID has to be an integer                      | typeof id === "Integer"                  |
| ID has to be bigger than 0                   | id > 0                                   |
| newIdTestDescriptor has to be an integer     | typeof newIdTestDescriptor === "Integer" |
| newIdTestDescriptor has to be bigger than 0  | newIdTestDescriptor > 0                  |
| newDate has to be of valid date-format       | typeof newDate === Date                  |
 | newResult has to of (primitive) boolean type | typeof newResult === "boolean"           |



**Boundaries**:

| Criteria                                    | Boundary values |
|---------------------------------------------|-----------------|
| ID has to be bigger than 0                  | 0               |
| newIdTestDescriptor has to be bigger than 0 | 0               |

**Combination of predicates**:


| ID is integer | ID is bigger than 0 | newIdSKu is integer | newIdTestDescriptor is bigger than 0 | newDate is of Date | newResult is of boolean | Valid / Invalid | Description of the test case                                                                                                 | Jest test case                       |
|---------------|---------------------|---------------------|--------------------------------------|--------------------|-------------------------|-----------------|------------------------------------------------------------------------------------------------------------------------------|--------------------------------------|
| true          | true                | true                | true                                 | true               | true                    | Valid           | db.updateTestResult({<br/>*newDate*: "2022-05-20",<br/>*newIdTestDescriptor*: 1,<br/>*newResult*: true}, 1);                 | reqWithCorrectData                   |
| **false**     | **false**           | true                | true                                 | true               | true                    | Invalid         | db.updateTestResult({<br/>*newDate*: "2022-05-20",<br/>*newIdTestDescriptor*: 1,<br/>*newResult*: true}, **"Not Integer"**); | reqWithNonIntegerId                  |
| true          | **false**           | true                | true                                 | true               | true                    | Invalid         | db.updateTestResult({<br/>*newDate*: "2022-05-20",<br/>*newIdTestDescriptor*: 1,<br/>*newResult*: true}, **0**);             | reqWithZeroId                        |
| true          | true                | **false**           | **false**                            | true               | true                    | Invalid         | db.updateTestResult({<br/>*newDate*: "2022-05-20",<br/>***newIdTestDescriptor*: "Not Integer"**,<br/>*newResult*: true}, 1); | reqWithNonIntegerNewIdTestDescriptor |
| true          | true                | true                | **false**                            | true               | true                    | Invalid         | db.updateTestResult({<br/>*newDate*: "2022-05-20",<br/>***newIdTestDescriptor*: 0**,<br/>*newResult*: true}, 1);             | reqWithZeroNewIdTestDescriptor       |
| true          | true                | true                | true                                 | **false**          | true                    | Invalid         | db.updateTestResult({<br/>***newDate*: "Not Date"**,<br/>*newIdTestDescriptor*: 1,<br/>*newResult*: true}, 1);               | reqWithNonDateNewDate                |
| true          | true                | true                | true                                 | true               | **false**               | Invalid         | db.updateTestResult({<br/>*newDate*: "2022-05-20",<br/>*newIdTestDescriptor*: 1,<br/>***newResult*: "Not boolean"**}, 1);    | reqWithNonBooleanNewResult           |





### **Class *TestResult* - method *deleteTestResult***

**Criteria for method *deleteTestResult*:**


- **ID** has to be an **integer**
- **ID** has to be **bigger than 0**


**Predicates for method *deleteTestResult*:**

| Criteria                                             | Predicate                          |
|------------------------------------------------------|------------------------------------|
| ID has to be an integer                              | typeof id === "Integer"            |
| ID has to be bigger than 0                           | id > 0                             |



**Boundaries**:

| Criteria                                              | Boundary values |
|-------------------------------------------------------|-----------------|
| ID has to be bigger than 0                            | 0               |



**Combination of predicates**:


| ID is integer | ID is bigger than 1 | Valid / Invalid | Description of the test case           | Jest test case                        |
|---------------|---------------------|-----------------|----------------------------------------|---------------------------------------|
| true          | true                | Valid           | db.deleteTestResult(1)                 | reqWithCorrectData()                  |
| **false**     | **false**           | Invalid         | db.deleteTestResult(**"Not Integer"**) | reqWithNonIntegerId()                 |
| true          | **false**           | Invalid         | db.deleteTestResult(**0**)             | reqWithZeroId()                       |


# White Box Unit Tests


| Unit name        | Jest test case                              |
|------------------|---------------------------------------------|
| getTestResults   | "getTestResults consistency test"           |
| addTestResult    | "addTestResult foreign key constraint"      |
| updateTestResult | "updateTestResult dropped table"            |
| updateTestResult | "updateTestResult id does not exist"        |
 | updateTestResult | "updateTestResult foreign key constraint"   |
| deleteTestResult | "deleteTestResult id does not exist         |
 | All              | "TestResult Dropped Table"                  |
 

### Loop coverage analysis


> There are no obvious loops or iterations in DAO nor in Controller.



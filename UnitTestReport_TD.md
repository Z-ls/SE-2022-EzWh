 ### **Class *TestDescriptor* - method *updateTestDescriptor***



**Criteria for method *updateTestDescriptor*:**
	

 - **ID** has to be an **integer** 
 - **ID** has to be **bigger than 0**
 - **newIdSKU** has to be an **integer** 
 - **newIdSKU** has to be **bigger than 0**
 - **newName** has to be a **non-empty** string
 - **newProcedureDescription** has to be a **non-empty** string




**Predicates for method *updateTestDescriptor*:**

| Criteria                                             | Predicate                          |
|------------------------------------------------------|------------------------------------|
| ID has to be an integer                              | typeof id === "Integer"            |
| ID has to be bigger than 0                           | id > 0                             |
| newIdSKU has to be an integer                        | typeof newIdSKU === "Integer"      |
| newIdSKU has to be bigger than 0                     | newIdSKU > 0                       |
| newName has to be a non-empty string                 | newName !== undefined              |
 | newProcedureDescription has to be a non-empty string | newProcedureDescription.length > 0 |



**Boundaries**:

| Criteria                                              | Boundary values |
|-------------------------------------------------------|-----------------|
| ID has to be bigger than 0                            | 0               |
| newIdSKU has to be bigger than 0                      | 0               |

**Combination of predicates**:


| ID is integer | ID is bigger than 0 | newIdSKu is integer | newIdSKU is bigger than 0 | newName is non-empty | newProcedureDescription is non-empty | Valid / Invalid | Description of the test case                                                                                                                                                  | Jest test case                       |
|---------------|---------------------|---------------------|---------------------------|----------------------|--------------------------------------|-----------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------|
| true          | true                | true                | true                      | true                 | true                                 | Valid           | db.updateTestDescriptor({<br/>*newName*: "New Test Descriptor 1",<br/>*newIdSKU*: 1,<br/>*newProcedureDescription*: "New This test is described by ..."}, 1);                 | reqWithCorrectData                   |
| **false**     | **false**           | true                | true                      | true                 | true                                 | Invalid         | db.updateTestDescriptor({<br/>*newName*: "New Test Descriptor 1",<br/>*newIdSKU*: 1,<br/>*newProcedureDescription*: "New This test is described by ..."}, **"Not Integer"**); | reqWithNonIntegerId                  |
| true          | **false**           | true                | true                      | true                 | true                                 | Invalid         | db.updateTestDescriptor({<br/>*newName*: "New Test Descriptor 1",<br/>*newIdSKU*: 1,<br/>*newProcedureDescription*: "New This test is described by ..."}, **0**);             | reqWithZeroId                        |
| true          | true                | **false**           | **false**                 | true                 | true                                 | Invalid         | db.updateTestDescriptor({<br/>*newName*: "New Test Descriptor 1",<br/>***newIdSKU*: "Not Integer"**,<br/>*newProcedureDescription*: "New This test is described by ..."}, 1); | reqWithNonIntegerNewIdSKU            |
| true          | true                | true                | **false**                 | true                 | true                                 | Invalid         | db.updateTestDescriptor({<br/>*newName*: "New Test Descriptor 1",<br/>***newIdSKU*: 0**,<br/>*newProcedureDescription*: "New This test is described by ..."}, 1);             | reqWithZeroNewIdSKU                  |
| true          | true                | true                | true                      | **false**            | true                                 | Invalid         | db.updateTestDescriptor({<br/>***newName*: undefined**,<br/>*newIdSKU*: 1,<br/>*newProcedureDescription*: "New This test is described by ..."}, 1);                           | reqWithEmptyNewName                  |
| true          | true                | true                | true                      | true                 | **false**                            | Invalid         | db.updateTestDescriptor({<br/>*newName*: "New Test Descriptor 1",<br/>*newIdSKU*: 1,<br/>***newProcedureDescription*: undefined**}, 1);                                       | reqWithEmptyNewProcedureDescription  |





### **Class *TestDescriptor* - method *deleteTestDescriptor***

**Criteria for method *deleteTestDescriptor*:**


- **ID** has to be an **integer**
- **ID** has to be **bigger than 0**


**Predicates for method *deleteTestDescriptor*:**

| Criteria                                             | Predicate                          |
|------------------------------------------------------|------------------------------------|
| ID has to be an integer                              | typeof id === "Integer"            |
| ID has to be bigger than 0                           | id > 0                             |



**Boundaries**:

| Criteria                                              | Boundary values |
|-------------------------------------------------------|-----------------|
| ID has to be bigger than 0                            | 0               |



**Combination of predicates**:


| ID is integer | ID is bigger than 1 | Valid / Invalid | Description of the test case               | Jest test case                        |
|---------------|---------------------|-----------------|--------------------------------------------|---------------------------------------|
| true          | true                | Valid           | db.deleteTestDescriptor(1)                 | reqWithCorrectData()                  |
| **false**     | **false**           | Invalid         | db.deleteTestDescriptor(**"Not Integer"**) | reqWithNonIntegerId()                 |
| true          | **false**           | Invalid         | db.deleteTestDescriptor(**0**)             | reqWithZeroId()                       |


# White Box Unit Tests


| Unit name            | Jest test case                                |
|----------------------|-----------------------------------------------|
| addTestDescriptor    | "addTestDescriptor foreign key constraint"    |
| updateTestDescriptor | "updateTestDescriptor dropped table"          |
| updateTestDescriptor | "updateTestDescriptor id does not exist"      |
 | updateTestDescriptor | "updateTestDescriptor foreign key constraint" |
| deleteTestDescriptor | "deleteTestDescriptor id does not exist       |
 | TestDescriptor       | "TestDescriptor Double-dropping table"        |

### Loop coverage analysis


> There are no obvious loops or iterations in DAO nor in Controller.



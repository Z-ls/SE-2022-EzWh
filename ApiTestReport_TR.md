# Integration and API Test Report

Date:

Version:

# Contents

- [Dependency graph](#dependency graph)

- [Integration approach](#integration)

- [Tests](#tests)

- [Scenarios](#scenarios)

- [Coverage of scenarios and FR](#scenario-coverage)
- [Coverage of non-functional requirements](#nfr-coverage)



# Dependency graph
     
![img.png](images/DepDiag_TestDesc_TestRes.png)

# Integration approach
    
> The approach we use here is ***Bottom-up***, in which we start from
> the lower-level DAO/repository modules up to Controllers.


#  Integration Tests

## Step 1

| Classes      | mock up used | Jest test cases                |
|--------------|--------------|--------------------------------|
| Test Result  |              | **updateTestResult Black Box** |
| Test Result  |              | **deleteTestResult Black Box** |


## Step 2

|            Classes             | mock up used | Jest test cases                                                                     |
|:------------------------------:|--------------|-------------------------------------------------------------------------------------|
| Test Result + Test Descriptor  |              | updateTestDescriptor Black Box:<br/>**reqWithNonIntegerNewIdTestDescriptor**        |
| Test Result + Test Descriptor  |              | updateTestDescriptor Black Box:<br/>**reqWithZeroNewIdTestDescriptor**              |
| Test Result + Test Descriptor  |              | TestResult Foreign Keys White Box:<br/>**addTestResult foreign key constraint**     |
| Test Result + Test Descriptor  |              | TestResult Foreign Keys White Box:<br/>**updateTestResult foreign key constraint**  |
| Test Result + Test Descriptor  |              | TestResult Foreign Keys White Box:<br/>**TestResult delete with foreign key**       |
| Test Result + Test Descriptor  |              | TestResult Foreign Keys White Box:<br/>**TestResult drop table with foreign key**   |

# API testing - Scenarios

## Scenario 5-2-4

| Scenario            |              Get all test results for a SKU Item              |
|---------------------|:-------------------------------------------------------------:|
| Precondition        |          Quality Employee Q exists and is logged in           |
|                     |                         SKU S exists                          |
|                     |                     SKU position is valid                     |
|                     |               The SKU Item has an RFID attached               |
| Post condition      |            The associated test results are fetched            |
| Step#               |                          Description                          |
| 1                   | Q requests to fetch all test results associated to a SKU Item |
| 2                   |                      Q confirms the data                      |

## Scenario 5-2-5

| Scenario            |                Get a test result for a SKU                 |
|---------------------|:----------------------------------------------------------:|
| Precondition        |         Quality Employee Q exists and is logged in         |
|                     |                        SKU S exists                        |
|                     |                   SKU position is valid                    |
|                     |             The SKU Item has an RFID attached              |
| Post condition      |           The associated test result is fetched            |
| Step#               |                        Description                         |
| 1                   | Q requests to fetch a test result associated to a SKU Item |
| 2                   |                    Q confirms the data                     |

## Scenario 5-2-6

| Scenario       |             Update a test result for a SKU Item             |
|----------------|:-----------------------------------------------------------:|
| Precondition   |         Quality Employee Q exists and is logged in          |
|                |                        SKU S exists                         |
|                |                    SKU position is valid                    |
|                |              The SKU Item has an RFID attached              |
| Post condition |            The associated test result is updated            |
| Step#          |                         Description                         |
| 1              | Q requests to update a test result associated to a SKU Item |
| 2              |                    Q sends the new data                     |
| 3              |                     Q confirms the data                     |

## Scenario 5-2-7

| Scenario       |             Delete a test result for a SKU Item             |
|----------------|:-----------------------------------------------------------:|
| Precondition   |         Quality Employee Q exists and is logged in          |
|                |                        SKU S exists                         |
|                |                    SKU position is valid                    |
|                |              The SKU Item has an RFID attached              |
| Post condition |            The associated test result is deleted            |
| Step#          |                         Description                         |
| 1              | Q requests to delete a test result associated to a SKU Item |
| 3              |                   Q confirms the deletion                   |


# Coverage of Scenarios and FR

| Scenario ID | Functional Requirements covered | Mocha  Test(s)                                   |
|-------------|---------------------------------|--------------------------------------------------|
| 5-2-1       | FR5.8.2                         | TEST POST /api/skuitems/testResult               |             
| 5-2-2       | FR5.8.2                         | TEST POST /api/skuitems/testResult               |
| 5-2-3       | FR5.8.2                         | TEST POST /api/skuitems/testResult               |
| 5-2-4       |                                 | TEST GET /api/skuitems/:rfid/testResults         |
| 5-2-5       |                                 | TEST GET /api/skuitems/:rfid/testResult/:id      |
| 5-2-6       |                                 | TEST PUT /api/skuitems/:rfid/testResult/:id      |
| 5-2-7       |                                 | TEST DELETE /api/skuitems/:rfid/testResult/:id   |



# Coverage of Non Functional Requirements

| Non Functional Requirement | Test name                                                                                                                                                                       |
|----------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| NFR2                       | All                                                                                                                                                                             |
| NFR6                       | TEST POST /api/skuitems/testResult<br/>TEST GET /api/skuitems/:rfid/testResults<br/>TEST GET /api/skuitems/:rfid/testResult/:id<br/>TEST PUT /api/skuitems/:rfid/testResult/:id |
| NFR9                       | TEST POST /api/skuitems/testResult<br/>TEST PUT /api/skuitems/:rfid/testResult/:id                                                                                              |


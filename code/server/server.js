'use strict';
const express = require('express');
const skus = require('./routes/sku');
const skuItems = require('./routes/skuItems');
const restockOrder = require('./routes/restockOrder');

// init express
const app = new express();
const port = 3001;

app.use(express.json());

app.use('/api', skus);
app.use('/api', skuItems);
app.use('/api', restockOrder);

//GET /api/test
app.get('/api/hello', (req, res) => {
  let message = {
    message: 'Hello World!'
  }
  return res.status(200).json(message);
});

//login
app.get('/api/login/:id', (req, res) => {
  let message = {
    message: 'Hello World!'
  }
  return res.status(200).json(message);
});

//logout
app.get('/api/logout', (req, res) => {
  app.logOut();
  let message = {
    message: 'Logging out'
  }
  return res.status(200).json(message);
});

//get User Info
app.get('/api/getUserInfo/:id', (req, res) => {
  let message = {
    message: 'Please enter user:'
  }
  return res.status(200).json(message);
});

//add Position
app.post('/api/addPosition', (req, res) => {
  let message = {
    message: 'Insert new position:'
  }
  return res.status(200).json(message);
});

//get Positions
app.get('/api/getPositions', (req, res) => {
  let message = {
    message: 'List of all positions:'
  }
  return res.status(200).json(message);
});

//edit Position
app.put('/api/editPosition', (req, res) => {
  let message = {
    message: 'Please enter position to edit'
  }
  return res.status(200).json(message);
});

//edit Position Barcode
app.put('/api/editPositionBarcode/:id', (req, res) => {
  let message = {
    message: 'Please enter position to edit'
  }
  return res.status(200).json(message);
});

//delete Position
app.delete('/api/deletePosition/:id', (req, res) => {
  let message = {
    message: 'Please enter position to delete'
  }
  return res.status(200).json(message);
});

//get Test Descriptors
app.get('/api/getTestDescriptors', (req, res) => {
  let message = {
    message: 'List of all Test Descriptors:'
  }
  return res.status(200).json(message);
});

//add Test Descriptor
app.post('/api/addTestDescriptor', (req, res) => {
  let message = {
    message: 'Insert test descriptor:'
  }
  return res.status(200).json(message);
});

app.put('/api/testDescriptor/:id', (req, res) => {
  let message = {
    message: ''
  }
  return res.status(200).json(message);
});

app.delete('/api/testDescriptor/:id', (req, res) => {
  let message = {
    message: `Delete Test Descriptor ${req.body.id} : Succeeded.`
  }
  return res.status(200).json(message);
});

app.get('/api/users', (req, res) => {
  let message = {
    message: ''
  }
  return users;
});

app.get('/api/suppliers', (req, res) => {
  let message = {
    message: ''
  }
  return suppliers;
});

app.post('/api/newUser', (req, res) => {
  // let newUser = new User(req.body.id...);
  let message = {
    message: `${newUser} added`
  }
  return res.status(200).json(message);
});

app.put('/api/users/:username', (req, res) => {
  let username = body.req.username;
  let message = {
    message: `${username} added`
  }
  return users.filter(u => u.username == username);
});

app.delete('/api/users/', (req, res) => {
  let message = {
    message: 'Please enter your username and password'
  }
  return users;
});

app.get('/api/internalOrdersIssued', (req, res) => {
  let message = {
    message: 'Please enter your username and password'
  }
  return internalOrders.filter(io => io.state == "ISSUED");
});

app.get('/api/internalOrdersAccepted', (req, res) => {
  let message = {
    message: 'Please enter your username and password'
  }
  return internalOrders.filter(io => io.state == "ACCEPTED");
});

app.get('/api/internalOrders/:id', (req, res) => {
  let id = req.body.id;
  let message = {
    message: `Internal Order ${id} fetched.`
  }
  return res.status(200).json(message);
});

app.get('/api/restockOrdersIssued', (req, res) => {
  let newIO = req.body.newIO;
  let message = {
    message: `Internal Order ${newIO} posted.`
  }
  return res.status(200).json(message);
});

app.put('/api/internalOrders/:id', (req, res) => {
  let id = req.body.id;
  let message = {
    message: `Internal Order ${id} updated.`
  }
  return res.status(200).json(message);
});

app.get('/api/restockOrdersIssued', (req, res) => {
  let id = req.body.id;
  let message = {
    message: `Restock Order ${id} updated.`
  }
  return restockOrders.filter(ro => ro.state === "ISSUED");
});

app.get('/api/restockOrders', (req, res) => {
  let id = req.body.id;
  let message = {
    message: `Restock Order ${id} updated.`
  }
  return restockOrders;
});

app.post('/api/restockOrder', (req, res) => {
  let id = req.body.id;
  let message = {
    message: `Restock Order ${id} added.`
  }
  return res.status(200).json(message);
});

// //getSingleRO
// app.get('/api/restockOrders/:id', (req,res)=>{
//   let message = {
//     message : 'Get restock Order with id:' + req.params.id + 'received',
//   }
//   return res.status(200).json(message);
// });

//editRO
app.put('/api/restockOrder/:id', (req, res) => {
  let message = {
    message: 'PUT restock order with id ' + req.params.id + " received",
    body: req.body.newRO
  }
  return res.status(200).json(message);
});

//addTrasnportNoteRO
app.put('/api/restockOrder/:id/transportNote', (req, res) => {
  let message = {
    message: 'PUT TransportNote with id ' + req.params.id + " to Restock Order received",
    body: req.body.newRO
  }
  return res.status(200).json(message);
});

app.put('/api/restockOrder/:id/skuItems', (req,res)=>{
  let message = {
    message: 'PUT Skuitem with id to RestockOrder' + req.params.id + " received",
    body: req.body.newRO
  }
  return res.status(200).json(message);
});

app.post('/api/skuitems/testResult', (req, res) => {
  let message = {
    message: 'Post test Result received',
    body: req.body.newTestResult
  }
  return res.status(200).json(message);
});

app.get('/api/skuitems/:rfid/testResults', (req, res) => {
  let message = {
    message: 'Get  test results from skuitem with rfid:' + req.params.rfid + 'received',
  }
  return res.status(200).json(message);
});


app.get('/api/restockOrders/:id/returnItems', (req, res) => {
  let message = {
    message: 'Get items from Order id:' + req.params.id + 'received',
  }
  return res.status(200).json(message);
});

app.post('/api/returnOrder', (req, res) => {
  let message = {
    message: 'Post Return Order received',
    body: req.body.newReo
  }
  return res.status(200).json(message);
});

app.get('/api/items', (req, res) => {
  let message = {
    message: 'Get items received'
  }
  return res.status(200).json(message);
});

app.post('/api/items', (req, res) => {
  let message = {
    message: 'Post item received',
    body: req.body.newItem
  }
  return res.status(200).json(message);
});

app.put('/api/items/:id', (req, res) => {
  let message = {
    message: 'Edit item with id ' + req.params.id + " received",
    body: req.body.newItem
  }
  return res.status(200).json(message);
});

app.delete('/api/items/:id', (req, res) => {
  let message = {
    message: 'Delete item with id ' + req.params.id + " received"
  }
  return res.status(200).json(message);
});

// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

module.exports = app;
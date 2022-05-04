'use strict';
const express = require('express');
// init express
const app = new express();
const port = 3001;
app.use(express.json());

const router = require('./routes/testDescriptorsRoutes');
app.use(router);

// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

module.exports = app;
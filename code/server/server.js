'use strict';
const express = require('express');
const skus = require('./routes/sku');
const skuItems = require('./routes/skuItems');
const item = require('./routes/item');
const restockOrder = require('./routes/restockOrder');
const pos = require('./routes/position');
const returnOrder = require('./routes/returnOrder');
const user = require('./routes/user');
const internalOrder = require('./routes/internalOrder');

// init express
const app = new express();
const port = 3001;
app.use(express.json());

const tdRouter = require('./routes/testDescriptorRoutes');
const trRouter = require('./routes/testResultRoutes');
app.use(tdRouter);
app.use(trRouter);
app.use('/api', returnOrder);
app.use('/api', pos);
app.use('/api', skus);
app.use('/api', skuItems);
app.use('/api', item);
app.use('/api', restockOrder);
app.use('/api', user);
app.use('/api', internalOrder);

// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

module.exports = app;

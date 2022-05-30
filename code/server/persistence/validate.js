const isInt = (value) => value === parseInt(value, 10) && typeof value === 'number';

module.exports = { isInt };
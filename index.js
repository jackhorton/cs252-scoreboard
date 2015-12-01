'use strict';

// use full ES6 everywhere else
require('babel/register');

const port = process.env.PORT || 8000;

require('./app').listen(port);

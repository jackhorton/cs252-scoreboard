'use strict';

// use full ES6 everywhere else
require('babel-core/register');

const port = process.env.PORT || 8000;

require('./app')['default'].listen(port);

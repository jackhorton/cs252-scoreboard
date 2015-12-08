'use strict';

// use full ES6 everywhere else
require('babel-core/register');

const port = process.env.VCAP_APP_PORT || 8000;
const host = process.env.VCAP_APP_HOST || 'localhost';

process.env.PGSSLMODE = 'require';

require('./app')['default'].listen(port, host, () => {
    console.log(`Starting server on host ${host} and port ${port}`);
});

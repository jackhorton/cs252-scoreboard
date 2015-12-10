import knex from 'knex';
import bookshelf from 'bookshelf';

const database = knex({
    client: 'pg',
    connection: process.env.CS252_DATABASE,
    debug: true
});
const orm = bookshelf(database);

orm.plugin('registry');

export default orm;

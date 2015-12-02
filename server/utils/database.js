import knex from 'knex';
import bookshelf from 'bookshelf';

const database = knex({
    client: 'mysql',
    connection: {
        host: process.env.CS252_DB_HOST,
        user: process.env.CS252_DB_USER,
        password: process.env.CS252_DB_PASSWORD,
        database: process.env.CS252_DB_DATABASE
    },
    pool: {
        min: 1,
        max: 1
    }
});
const orm = bookshelf(database);

orm.plugin('registry');

export default orm;

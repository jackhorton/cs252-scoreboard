import express from 'express';
import initModels from './models/init';
import userController from './controllers/user';

const app = express();

initModels();

app.use(userController());

app.use((err, req, res, next) => {
    console.error('==============================');
    console.error(`ERROR: ${err.message}`);

    if (!err.code) {
        res.status(500).send({status: 'failure', error: 'Application error'});
        console.error(`STACK\n${err.stack}`);
    } else {
        res.status(err.code).send({status: 'failure', error: err.message});
        console.error(`ORIGINAL STACK\n${err.original.stack}`);
        console.error(`STACK\n${err.stack}`);
    }

    console.error('==============================');
    return next();
});

export default app;

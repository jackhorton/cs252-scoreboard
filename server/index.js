import express from 'express';
import initModels from './models/init';
import userController from './controllers/user';
import signUpController from './controllers/sign-up';

const app = express();

initModels();

app.use(userController());
app.use(signUpController());

app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
    console.error('==============================');
    console.error(`ERROR: ${err.message}`);

    if (!err.code) {
        res.status(500).send({status: 'failure', error: 'Application error'});
        console.error(`STACK\n${err.stack}`);
    } else {
        res.status(err.code).send({status: 'failure', error: err.message});

        if (err.code >= 500) {
            if (err.original) {
                console.error(`ORIGINAL STACK\n${err.original.stack}`);
            }

            console.error(`STACK\n${err.stack}`);
        }
    }

    console.error('==============================');
});

export default app;

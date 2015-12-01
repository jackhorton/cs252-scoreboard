import express from 'express';
import initModels from './models/init';
import userController from './controllers/user';

const app = express();

initModels();

app.use(userController());

export default app;

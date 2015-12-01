import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import api from './server';
import client from './client';

const app = express();

// middleware
app.use(morgan(process.env.NODE_ENV === 'production' ? 'short' : 'dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// routes
app.use('/api', api);
app.use(client);

export default app;

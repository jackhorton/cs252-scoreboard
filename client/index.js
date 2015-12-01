import express from 'express';

const app = express();

app.use('/build', express.static('./build'));

app.get('*', (req, res, next) => {
    res.sendFile('./index.html');
});

export default app;

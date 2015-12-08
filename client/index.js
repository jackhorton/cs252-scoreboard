import express from 'express';
import path from 'path';

const app = express();

app.use('/dist', express.static('./dist'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

export default app;

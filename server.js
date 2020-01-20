console.debug('environement', process.env.NODE_ENV);

if (process.env.NODE_ENV !== 'prod') {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const path = require('path');
const PORT = process.env.PORT;
app.use(express.static(path.join(__dirname, 'app')));

app.use('/push', require('./server/api/push'));

app.get('*', (_, res) => res.sendFile(path.join(__dirname, 'app/index.html')));

server.listen(PORT, () => console.log(`Pushpoc is running and listening on port ${PORT}`));

const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const path = require('path');
const pushAPI = require('./server/api/push');
const port = 3000;
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'app')));

app.use('/', pushAPI);

app.get('*', (_, res) => res.sendFile(path.join(__dirname, 'app/index.html')));

server.listen(port, () => console.log(`PushPoc is running and listening on port ${port}`));

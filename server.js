const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const path = require('path');
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'dist/pushpoc')));

app.get('*', (_, res) => res.sendFile(path.join(__dirname, 'app/index.html')));

server.listen(PORT, () => console.log(`Pushpoc is running and listening on port ${PORT}`));

// imports
const express = require('express');
const dotenv = require('dotenv');
const https = require('https');
const DataBase = require('./DataBase/DataBase');
const usersRoutes = require('./routes/users.route');

// setups
const app = express();
dotenv.config();
const PORT = process.env.PORT;



// test if server is alive
app.get('/', (req, res) => res.json({ message: 'server is alive', success: true }));

DataBase.connect().then(() => {
    const sslServer = https.createServer({
        key: process.env.SSL_KEY,
        cert: process.env.SSL_CERT
    }, app);
    sslServer.listen(PORT, () => console.log('Server: ', `Connected to https://localhost:${PORT}`));

}).catch((err) => console.log('Start Error: ', err));

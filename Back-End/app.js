// imports
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const DataBase = require('./DataBase/DataBase');
const usersRoutes = require('./routes/users.route');
const vacationsRoutes = require('./routes/vacation.route');
// setups
const app = express();
dotenv.config();
const PORT = process.env.PORT;

// uses
app.use(cors());
app.use(express.json({ limit: "25mb" }));

// paths
app.use('/users', usersRoutes);
app.use('/vacations', vacationsRoutes);

// test if server is alive
app.get('/', (req, res) => res.json({ message: 'server is alive', success: true }));

DataBase.connect().then(() => {

    app.listen(PORT, () => console.log('Server: ', `Connected to http://localhost:${PORT}`));

}).catch((err) => console.log('Start Error: ', err));

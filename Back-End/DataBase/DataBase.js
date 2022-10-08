// imports
const { default: mongoose } = require("mongoose");

// setups
const dotenv = require('dotenv');
dotenv.config();

// main class
module.exports = class DataBase {
    static #HOST = process.env.DB_HOST;
    static #DB = process.env.DB_NAME;
    static #SETTINGS = process.env.DB_SETTINGS;
    static async connect() {
        await mongoose.connect(`${this.#HOST}${this.#DB}${this.#SETTINGS}`)
            .then(() => console.log('DataBase: ', 'connected to DataBase.'))
            .catch((err) => console.log("DataBase, Error: ", err));
    }
    static async disconnect() {
        await mongoose.disconnect();
    }
    static getConnection() {
        return mongoose.connection;
    }
    static getCollections() {
        console.log("Collections: ", mongoose.Collection);
    }
}
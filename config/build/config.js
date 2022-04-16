require('dotenv').config();

const MONGO_DB_PASSWORD = process.env.MONGO_DB_PASSWORD;
module.exports = {
    MONGO_DB_PASSWORD
}

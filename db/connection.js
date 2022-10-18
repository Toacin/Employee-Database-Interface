const mysql = require("mysql2");

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'team_db',
    password: '1004'
})

module.exports = db;
const mysql = require("mysql2");

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: '',
    password: '1004'
})

db.connect((error) => {
    if (error) throw error;
    console.log("Successfully connected to database")
})

module.exports = db;
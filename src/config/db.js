const mysql = require("mysql");
const dotenv = require("dotenv");

// .env file ko load karna
dotenv.config();


// MySQL connection create karna
const conn = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});


// Connection check karna
conn.connect((err) => {
    if (err) {
        console.error('Database connection failed: ', err.message);
        return;
    }
    console.log('Connected to MySQL database!');
});

module.exports = conn;
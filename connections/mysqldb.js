const mysql = require('mysql'); // to call mysql lib

const db = mysql.createConnection({
    host        : process.env.DB_HOST,
    user        : process.env.DB_USER,
    password    : process.env.DB_PASS,
    database    : process.env.DB_DATABASE,
    // port        : 3306 --> default
});

db.connect((error)=>{
    error ? console.log('Database Error '+error.message) : console.log('DB connect sukses');
});

module.exports = db;
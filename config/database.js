const mysql = require('mysql');

const db = mysql.createConnection({
    // host: 'localhost',
    // user: 'root',
    // password: '',
    // database: 'warehouse',
    host: '144.91.69.55',
    user: 'azad',
    password: 'B4xBTB2u@',
    database: 'warehouse',
});

db.connect(err => {
    if(err) throw err;
    // console.log("Connected (message from DB)")
})

module.exports = db;

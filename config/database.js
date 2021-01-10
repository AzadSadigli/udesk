const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'warehouse',
});

db.connect(err => {
    if(err) throw err;
    // console.log("Connected (message from DB)")
})

module.exports = db;

const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'db4free.net',
    user: 'rootfistaxi',
    password: 'a113114115',
    database: 'fistaxidb'
});

connection.connect(function (err) {
    if (err) throw err;
}); 

module.exports = connection;
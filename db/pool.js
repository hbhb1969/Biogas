// Datenbank auf localhost
const mysql = require('mysql');
const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: 'passwort',
  database: 'BGA',
  multipleStatements: true
});

module.exports = pool;
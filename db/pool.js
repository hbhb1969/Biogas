const mysql = require('mysql');
const pool = mysql.createPool({
  connectionLimit: 10,
  host: '193.164.131.231',
  user: 'root',
  password: '7E6qH3f2xA1uNZK',
  database: 'BGA'
});
// const mysql = require('mysql');
// const pool = mysql.createPool({
//   connectionLimit: 10,
//   host: 'localhost',
//   user: 'root',
//   password: 'passwort',
//   database: 'BGA'
// });

module.exports = pool;
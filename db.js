const mysql = require('mysql2');
var db;

function getDb() {
  if (!db) {
    db = mysql.createConnection({
      host: 'db',
      user: 'root',
      password: 'root',
      database: 'envelope-game'
    });
  }
  return db;
}

module.exports = getDb();
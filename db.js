const mysql = require('mysql2');
var db;

function getDb() {
  if (!db) {
    db = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: 'envelope-game'
    });
  }
  
  return db;
}

module.exports = getDb();

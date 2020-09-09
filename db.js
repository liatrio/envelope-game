const mysql = require('mysql');
var db;

function getDb() {
  if (!db) {
    db = mysql.createConnection({
      host: 'db',
      user: 'root',
      password: 'root',
      database: 'envelope-game'
    });

    db.connect(function (err) {
      if (err) {
        throw (err)
      }
      else {
        console.log('Error connecting to database');

      }

    });
  }
  return db;
}

module.exports = getDb();
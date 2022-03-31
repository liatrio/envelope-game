const mysql = require('mysql2');
var db;

function getDb() {
  if (!db) {
    db = mysql.createConnection({
      host: 'envelope-game.mysql.database.azure.com',
      user: 'envelope-game@envelope-game',
      password: 'J2g{G)YG1qv3nQ=k',
      database: 'envelope-game'
    });
  }

  db.connect(
    function(err) {
      if (err) {
        console.log("Cannot connect, error: ");
        throw err;
      }
      else {
        console.log("Connection established");
        initData();
      }
    }
  );

  return db;
}

module.exports = getDb();

// const mysql = require('mysql');
// const fs = require('fs');

// var config = {
//   host: 'envelope-game.mysql.database.azure.com',
//   user: 'envelope-game@envelope-game',
//   password: 'J2g{G)YG1qv3nQ=k',
//   database: 'envelope-game',
//   port: 3306
//   // ssl:
// };

// const conn = new mysql.createConnection(config);

// conn.connect(
//   function(err) {
//     if (err) {
//       console.log("Cannot connect, error: ");
//       throw err;
//     }
//     else {
//       console.log("Connection established");
//       initData();
//     }
//   }
// );

// function initData() {

// }

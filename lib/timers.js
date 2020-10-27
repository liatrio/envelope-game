const db = require('../db');

class Timer {
  constructor(gameId, team1Id, team2Id) {
    this.gameId = gameId
    this.team1Id = team1Id
    this.team2Id = team2Id
    this.interval = null
    this.tick = this.tick.bind(this);

  }

  start() {
    this.interval = setInterval(() => this.tick(this.team1Id), 1000)
  }

  stop() {
    clearInterval(this.interval)
  }

  async tick(team1Id) {
    
    var team1Completed = 0, team2Completed = 0;
    // UPDATE ENVELOPES SET seat_number = 2 WHERE game_id = 'iHAw3Ri5kJ6K9Pba' AND team_id = 'ID854KSj66w64rBW';
    // fetch completed envelopes for each team
    let envCompleted = `SELECT team_id FROM ENVELOPES WHERE seat_number = 3 AND game_id = '${this.gameId}'`;
    db.promise().query(envCompleted).then(([rows, fields]) => {
      rows.forEach(stuff => {
        if (stuff.team_id === team1Id) {
          team1Completed++;
        } else {
          team2Completed++;
        }
      });
      let updateScore = `UPDATE GAME SET team_1_completed = ${team1Completed}, team_2_completed = ${team2Completed}, score_1 = score_1 + ${team1Completed}, score_2 = score_2 + ${team2Completed}, game_tick = game_tick + 1 WHERE game_id = '${this.gameId}'`;
      db.query(updateScore, function (err, result) {
        if (err) throw err;
      });
    }); 
  }
}

class Timers {
  constructor() {
    this.timers = [];
    this.addGame = this.addGame.bind(this);
    this.startTimer = this.startTimer.bind(this);
    this.stopTimer = this.stopTimer.bind(this);
  }

  addGame(gameId, team1Id, team2Id) {
    var timer = new Timer(gameId, team1Id, team2Id);
    this.timers[gameId] = timer;
  }

  startTimer(gameId) {
    this.timers[gameId].start();
  }

  stopTimer(gameId) {
    this.timers[gameId].stop();
  }
}


module.exports = new Timers();

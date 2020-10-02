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
    
    console.log("game id in timers" + this.gameId);
    console.log("team 1 id in timers" + this.team1Id);
    var team1Completed = 0, team2Completed = 0;

    // fetch completed envelopes for each team
    let envCompleted = `SELECT team_id FROM ENVELOPES WHERE seat_number = 3 AND game_id = '${this.gameId}'`;
    db.promise().query(envCompleted).then(([rows, fields]) => {
      console.log(rows);
      rows.forEach(stuff => {
        console.log("result 31: " + stuff.team_id);
        console.log("result 32: " + team1Id);
        if (stuff.team_id === team1Id) {
          console.log("in 32");
          team1Completed++;
        }
        else {
          console.log("in 36");
          team2Completed++;
        }
      });
      //console.log("team 1 completed: " + team1Completed);
      let updateScore = `UPDATE GAME SET score_1 = score_1 + ${team1Completed}, score_2 = score_2 + ${team2Completed}, game_tick = game_tick + 1 WHERE game_id = '${this.gameId}'`;
      db.query(updateScore, function (err, result) {
        if (err) throw err;
        console.log(result);
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
    console.log("team1: " + team1Id);
    var timer = new Timer(gameId, team1Id, team2Id);
    this.timers[gameId] = timer;
  }

  startTimer(gameId) {
    console.log("in start");
    this.timers[gameId].start();
  }

  stopTimer(gameId) {
    this.timers[gameId].stop();
  }
}


module.exports = new Timers();
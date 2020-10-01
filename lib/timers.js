const mysql = require('mysql2/promise');
const db = mysql.createConnection({
  host: 'db',
  user: 'root',
  password: 'root',
  database: 'envelope-game'
});
var timers;

class Timer {
  constructor(gameId, team1Id, team2Id) {
    this.gameId = gameId
    this.team1Id = team1Id
    this.team2Id = team2Id
    this.interval = null
    this.tick = this.tick.bind(this);

  }

  start() {
    this.interval = setInterval(() => this.tick(this.team1Id), 2000)
  }

  stop() {
    clearInterval(this.interval)
  }

  async tick(team1Id) {

    console.log("game id in timers" + this.gameId);
    console.log("team 1 id in timers" + this.team1Id);
    var team1Completed = 0, team2Completed = 0;

    // fetch completed envelops for each team
    let envCompleted = `SELECT team_id FROM ENVELOPES WHERE seat_number = 3 AND game_id = '${this.gameId}'`;
    const result = await db.query(envCompleted);
      result.forEach(stuff => {
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
      console.log("team 1 completed: " + team1Completed);
      let updateScore = `UPDATE GAME SET score_1 = score_1 + 5, score_2 = score_2 + ${team2Completed} WHERE game_id = '${this.gameId}'`;
      db.query(updateScore, function (err, result) {
        if (err) throw err;
        console.log(result);
      });
    /* console.log("38" + this.team1Id);
    let team1CurrentScore = `SELECT score_1 FROM GAME WHERE team_1_id = '${this.team1Id}' AND game_id = '${this.gameId}'`;
    let team2CurrentScore = `SELECT score_2 FROM GAME WHERE team_2_id = '${this.team2Id}' AND game_id = '${this.gameId}'`;
    //let updateScore = `UPDATE GAME SET score = '${req.params.score}' WHERE team_id = '${req.params.team_id}' AND game_id = '${req.params.game_id}'`;
    db.query(team1CurrentScore, function (err, result) {
      if (err) throw err;
      if (isNaN()) {
        score_team1 = 0;
      }
      score_team1 = result.score_1;
    })

    db.query(team2CurrentScore, function (err, result) {
      if (err) throw err;
      if (result.score_2 === NaN) {
        score_team2 = 0;
      }
      score_team2 = result.score_2;
    })

    score_team1 += team1Completed;
    score_team2 += team2Completed; */
    
    /* let updateScore2 = `UPDATE GAME SET score_2 = score_2 + ${team2Completed} WHERE team_2_id = '${this.team2Id}' AND game_id = '${this.gameId}'`;
    db.query(updateScore2, function (err, result) {
      if (err) throw err;
    }) */
    // calculate new score
    // save score to db
  }
}

class Timers {
  constructor() {
    this.timers = [];
    this.addGame = this.addGame.bind(this);
    this.startTimer = this.startTimer.bind(this);
    this.stopTimer = this.stopTimer.bind(this);

    /* this.gameId = gameId
    this.team1Id = team1Id
    this.team2Id = team2Id */
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

/* function getTimers() {
  if (!timers) {
    timers = new Timers();
  }
  return timers;
} */

module.exports = new Timers();

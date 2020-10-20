//import Timers from '../lib/timers';
const { nanoid } = require('nanoid/non-secure');
const { Router } = require('express');
const router = Router();
const db = require('../db');
const timer = require('../lib/timers');


const numEnvelopes = 20;
//const timer = new Timers();
// endpoint to create a game
router.get('/api/create', (req, res) => {

  // generate a game and facilitator id
  let gameId = nanoid(16);
  let facilitatorId = nanoid(16);

  // generate team ids
  let teamIds = [nanoid(16), nanoid(16)];


  // generate ids for seats
  let seatIds = []
  for (let i = 0; i < 6; i++) {
    seatIds[i] = nanoid(16);
  }

  // insert create team skeletons
  let values = [
    [teamIds[0], 0, true],
    [teamIds[1], 0, false]
  ];
  let sql = 'INSERT INTO TEAMS (team_id, envelopes_completed, is_team_1) VALUES ?';
  db.query(sql, [values], function (err, result) {
    if (err) throw err;
  });

  // create game instance
  values = [
    [gameId, (seatIds.length / 2), facilitatorId, teamIds[0], teamIds[1], 0, 0, 0]
  ];
  sql = 'INSERT INTO GAME (game_id, total_stages, facilitator_id, team_1_id, team_2_id, score_1, score_2, game_tick) VALUES ?';
  db.query(sql, [values], function (err, result) {
    if (err) throw err;
  });

  // create seats
  values = [];
  for (let i = 0; i < seatIds.length; i++) {
    if (i < seatIds.length / 2) {
      values[i] = [seatIds[i], i % 3, 0, 0, false, gameId, teamIds[0]];
    } else {
      values[i] = [seatIds[i], i % 3, 0, 0, false, gameId, teamIds[1]];
    }
  }
  sql = 'INSERT INTO SEATS (seat_id, seat_number, envelopes_completed, envelopes_ready, is_taken, game_id, team_id) VALUES ?';
  db.query(sql, [values], function (err, result) {
    if (err) throw err;
  });

  values = [];
  for (let i = 0; i < numEnvelopes; i++) {
    values[i] = [nanoid(16), 0, Math.random() * (numEnvelopes - 1) + 1, gameId, teamIds[0], 0, true];
    values[i + numEnvelopes] = [nanoid(16), 0, Math.random() * (numEnvelopes - 1) + 1, gameId, teamIds[1], 0, false];
  }
  sql = 'INSERT INTO ENVELOPES (envelope_id, envelope_state, matching_stamp, game_id, team_id, seat_number, is_team_1) VALUES ?';
  db.query(sql, [values], function (err, result) {
    if (err) throw err;
  });
  timer.addGame(gameId, teamIds[0], teamIds[1]);
  res.send({ game: gameId, facilitator: facilitatorId });
});

router.get('/api/join/:gameId', (req, res) => {
  let sql = `SELECT SEATS.seat_number, SEATS.seat_id, SEATS.is_taken, SEATS.display_name, GAME.game_id, TEAMS.team_id, TEAMS.is_team_1, TEAMS.team_name, GAME.is_started, GAME.team_1_id, GAME.team_2_id
               FROM SEATS 
               INNER JOIN GAME on GAME.game_id = SEATS.game_id 
               INNER JOIN TEAMS on TEAMS.team_id = SEATS.team_id 
               WHERE SEATS.game_id = '${req.params.gameId}';`

  db.query(sql, function (err, result) {
    if (err) throw err;
    // if result from query is of length 0 then query was invalid
    if (result.length === 0) {
      res.send({ game: null });
    }
    let summary = {};
    summary.game = result[0].game_id;
    summary.isStarted = result[0].is_started;
    summary.team1 = result[0].team_1_id;
    summary.team2 = result[0].team_2_id;
    summary.seats = [];

    for (let i of result) {
      let seat = {};
      seat.seatId = i.seat_id;
      seat.isTaken = (i.is_taken === 1) ? true : false;
      seat.isTeam1 = (i.is_team_1 === 1) ? true : false;
      seat.seatNumber = i.seat_number;
      seat.teamId = i.team_id;
      seat.displayName = i.display_name;
      if (i.is_team_1 === 1) {
        summary.team1Name = i.team_name;
      } else if (i.is_team_1 === 0) {
        summary.team2Name = i.team_name;
      }
      summary.seats.push(seat);
    }

    res.send(summary);
  });
});

router.get('/api/game-state/:id', (req, res) => {
  let sql = `SELECT envelope_id, envelope_state, seat_number, is_team_1, envelope_end, matching_stamp, is_started, ENVELOPES.game_id, team_id, GAME.team_1_id, GAME.team_2_id, GAME.score_1, GAME.score_2, GAME.game_tick
             FROM ENVELOPES 
             INNER JOIN GAME on GAME.game_id = ENVELOPES.game_id
             WHERE ENVELOPES.game_id = '${req.params.id}'`;
  db.query(sql, function (err, result) {
    if (err) throw err;

    res.send({
      gameId: result[0].gameId,
      startTime: result[0].start_time,
      isStarted: result[0].is_started,
      team1: result[0].team_1_id,
      team2: result[0].team_2_id,
      score1: result[0].score_1,
      score2: result[0].score_2,
      gameTick: result[0].game_tick,
      envelopes: result.map((i) => {
        return ({
          envelopeId: i.envelope_id,
          matchingStamp: i.matching_stamp,
          envelopeState: i.envelope_state,
          team: i.team_id,
          isTeam1: i.is_team_1,
          seatNumber: i.seat_number
        });
      })
    });
  });
});

router.post('/api/set-team-name', (req, res) => {
  let sql = `UPDATE TEAMS INNER JOIN GAME on GAME.team_1_id = team_id or GAME.team_2_id = team_id
             SET team_name = '${req.body.teamName}'
             WHERE team_id = '${req.body.teamId}'
             AND facilitator_id = '${req.body.facilitatorId}'`;

  db.query(sql, function (err, result) {
    if (err) throw err;
    console.log(result);
    if (result.changedRows !== 1) {
      res.send({ success: false });
    } else {
      res.send({ success: true });
    }
  });
});

router.post('/api/set-player-name', (req, res) => {
  let sql = `UPDATE SEATS
                SET display_name = '${req.body.displayName}'
                WHERE seat_id = '${req.body.seatId}'`;

  console.log(sql);

  db.query(sql, function (err, result) {
    if (err) throw err;

    console.log(result);
    if (result.changedRows !== 1) {
      res.send({ success: false });
    } else {
      res.send({ success: true });
    }
  });
});

router.get('/api/choose-seat/:teamId/:seatId', (req, res) => {
  let sql = `UPDATE SEATS SET is_taken = 1 WHERE seat_id = '${req.params.seatId}'
             AND team_id = '${req.params.teamId}' 
             AND is_taken = 0`;
  console.log(sql);

  db.query(sql, function (err, result) {
    if (err) throw err;
    // if there was not a changed row then seat is already taken
    // or invalid request
    console.log(result);
    if (result.changedRows !== 1) {
      res.send({ success: false });
    } else {
      // return a confirmation of success and the seat id
      res.send({ success: true, seatId: req.params.seatId });
    }
  })
});

router.get('/api/update-envelope/:gameId/:envelopeId/:state', (req, res) => {
  let sql = `UPDATE ENVELOPES
             SET envelope_state = '${req.params.state}'
             WHERE game_id = '${req.params.gameId}'
             AND envelope_id = '${req.params.envelopeId}'`;
  db.query(sql, function (err, result) {
    if (err) throw err;
    res.json({ success: true });
  });

});

// used to advance an envelope to the next seat
router.post('/api/move-envelope', (req, res) => {
  let sql = `UPDATE ENVELOPES 
             SET seat_number = ${req.body.nextSeat}, 
                 envelope_state = 0 
             WHERE envelope_id IN (?)`;

  db.query(sql, [req.body.envelopes], function (err, result) {
    if (err) throw err;
    if (result.changedRows !== req.body.envelopes.length) {
      res.send({ success: false });
    } else {
      res.send({ success: true });
    }
  });
});

router.get('/api/start-game/:facilitatorId/:gameId', (req, res) => {
  let sql = `UPDATE GAME
             SET is_started = ${true}
             WHERE facilitator_id = '${req.params.facilitatorId}'
             AND game_id = '${req.params.gameId}'`;
  db.query(sql, function (err, result) {
    if (err) throw err;
    timer.startTimer(req.params.gameId);
    db.query(sql, function (err, result) {
      if (err) throw err;
      if (result.changedRows !== 1) {
        res.send({ success: false });
      } else {
        res.send({ success: true });
      }
    });
  });
});


router.get('/api/stop-game/:facilitatorId/:gameId', (req, res) => {
  let sql = `UPDATE GAME
             SET is_started = ${false}
             WHERE facilitator_id = '${req.params.facilitatorId}'
             AND game_id = '${req.params.gameId}'`;
  db.query(sql, function (err, result) {
    if (err) throw err;
    timer.stopTimer(req.params.gameId);
    // return if query succeeded or not
    if (result.changedRows !== 1) {
      res.send({ success: false });
    } else {
      res.send({ success: true });
    }
  });
});

if (module.hot) {
  module.hot.accept();
}

module.exports = router;


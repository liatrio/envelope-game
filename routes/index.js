const { nanoid } = require('nanoid/non-secure');
const { Router } = require('express');
const router = Router();
const moment = require('moment');
const db = require('../db');

const num_env = 20;


// endpoint to create a game
router.get('/api/create', (req, res) => {
  // generate a game and facilitator id
  let game_id = nanoid(16);
  let facilitator_id = nanoid(16);

  // generate team ids
  let team_ids = [nanoid(16), nanoid(16)];

  // generate ids for seats
  let seat_ids = []
  for (let i = 0; i < 6; i++) {
    seat_ids[i] = nanoid(16);
  }

  // insert create team skeletons
  let values = [
    [team_ids[0], 0, true],
    [team_ids[1], 0, false]
  ];
  let sql = 'INSERT INTO TEAMS (team_id, envelopes_completed, is_team_1) VALUES ?';
  db.query(sql, [values], function (err, result) {
    if (err) throw err;
  });

  // create game instance
  values = [
    [game_id, (seat_ids.length / 2), facilitator_id, team_ids[0], team_ids[1]]
  ];
  sql = 'INSERT INTO GAME (game_id, total_stages, facilitator_id, team_1_id, team_2_id) VALUES ?';
  db.query(sql, [values], function (err, result) {
    if (err) throw err;
  });

  // create seats
  values = [];
  for (let i = 0; i < seat_ids.length; i++) {
    if (i < seat_ids.length / 2) {
      values[i] = [seat_ids[i], i % 3, 0, 0, false, game_id, team_ids[0]];
    }
    else {
      values[i] = [seat_ids[i], i % 3, 0, 0, false, game_id, team_ids[1]];
    }
  }
  sql = 'INSERT INTO SEATS (seat_id, seat_number, envelopes_completed, envelopes_ready, is_taken, game_id, team_id) VALUES ?';
  db.query(sql, [values], function (err, result) {
    if (err) throw err;
  });

  values = [];
  for (let i = 0; i < num_env; i++) {
    values[i] = [nanoid(16), 0, Math.random() * (num_env - 1) + 1, game_id, team_ids[0], 0];
    values[i + num_env] = [nanoid(16), 0, Math.random() * (num_env - 1) + 1, game_id, team_ids[1], 0];
  }
  sql = 'INSERT INTO ENVELOPES (envelope_id, envelope_state, matching_stamp, game_id, team_id, seat_number) VALUES ?';
  db.query(sql, [values], function (err, result) {
    if (err) throw err;
  });
  res.send({ game: game_id, facilitator: facilitator_id });
});

router.get('/api/join/:game_id', (req, res) => {
  let sql = `SELECT SEATS.seat_number, SEATS.seat_id, SEATS.is_taken, SEATS.display_name, GAME.game_id, TEAMS.team_id, TEAMS.is_team_1, TEAMS.team_name, GAME.start_time, GAME.team_1_id, GAME.team_2_id
               FROM SEATS 
               INNER JOIN GAME on GAME.game_id = SEATS.game_id 
               INNER JOIN TEAMS on TEAMS.team_id = SEATS.team_id 
               WHERE SEATS.game_id = '${req.params.game_id}';`

  db.query(sql, function (err, result) {
    if (err) throw err;

    // if result from query is of length 0 then query was invalid
    if (result.length === 0) {
      res.send({ game: null });
    }
    let summary = {};
    summary.game = result[0].game_id;
    summary.is_started = (result[0].start_time === null) ? false : true;
    summary.team_1_id = result[0].team_1_id;
    summary.team_2_id = result[0].team_2_id;
    summary.seats = [];


    for (let i of result) {
      let seat = {};
      seat.seat_id = i.seat_id;
      seat.is_taken = (i.is_taken === 1) ? true : false;
      seat.is_team_1 = (i.is_team_1 === 1) ? true : false;
      seat.seat_number = i.seat_number;
      seat.team_id = i.team_id;
      seat.display_name = i.display_name;
      if (i.is_team_1 === 1) {
        summary.teamName_1 = i.team_name;
      }
      else if (i.is_team_1 === 0) {
        summary.teamName_2 = i.team_name;
      }
      summary.seats.push(seat);
    }

    res.send(summary);
  });
});

router.get('/api/game-state/:id', (req, res) => {
  let sql = `SELECT envelope_id, envelope_state, seat_number, envelope_state, envelope_end, matching_stamp, start_time, ENVELOPES.game_id, team_id, GAME.team_1_id, GAME.team_2_id
             FROM ENVELOPES 
             INNER JOIN GAME on GAME.game_id = ENVELOPES.game_id
             WHERE ENVELOPES.game_id = '${req.params.id}'`;
  db.query(sql, function (err, result) {
    if (err) throw err;

    res.send({
      game_id: result[0].game_id,
      start_time: result[0].start_time,
      team_1_id: result[0].team_1_id,
      team_2_id: result[0].team_2_id,
      envelopes: result.map((i) => {
        return ({
          envelope_id: i.envelope_id,
          matching_stamp: i.matching_stamp,
          envelope_state: i.envelope_state,
          team: i.team_id,
          seat_number: i.seat_number,
          envelope_finish: i.envelope_end
        });
      })
    });
  });
});

router.post('/api/set-team-name', (req, res) => {
  let sql = `UPDATE TEAMS INNER JOIN GAME on GAME.team_1_id = team_id or GAME.team_2_id = team_id
             SET team_name = '${req.body.team_name}'
             WHERE team_id = '${req.body.team_id}'
             AND facilitator_id = '${req.body.facilitator_id}'`;

  db.query(sql, function (err, result) {
    if (err) throw err;

    if (result.changedRows !== 1) {
      res.send({ success: false });
    } else {
      res.send({ success: true });
    }
  });
});

router.post('/api/set-player-name', (req, res) => {
  let sql = `UPDATE SEATS
                SET display_name = '${req.body.display_name}'
                WHERE seat_id = '${req.body.seat_id}'`;

  db.query(sql, function (err, result) {
    if (err) throw err;

    if (result.changedRows !== 1) {
      res.send({ success: false });
    } else {
      res.send({ success: true });
    }
  });
});

router.get('/api/choose-seat/:game_id/:seat_id', (req, res) => {
  let sql = `UPDATE SEATS SET is_taken = 1 WHERE seat_id = '${req.params.seat_id}'
             AND game_id = '${req.params.game_id}' and is_taken = 0`;
  db.query(sql, function (err, result) {
    if (err) throw err;
    // if there was not a changed row then seat is already taken
    // or invalid request
    if (result.changedRows !== 1) {
      res.send({ success: false });
    } else {
      // return a confirmation of success and the seat id
      res.send({ success: true, seat_id: req.params.seat_id });
    }
  })
});

router.get('/api/update-envelope/:game_id/:envelope_id/:seat_number/:state', (req, res) => {
  let sql = `UPDATE ENVELOPES
             SET seat_number = '${req.params.seat_number}',
                 envelope_state = '${req.params.state}'
             WHERE game_id = '${req.params.game_id}'
             AND envelope_id = '${req.params.envelope_id}'`;
  db.query(sql, function (err, result) {
    if (err) throw err;
    if (result.changedRows !== 1) {
      res.send({ success: false });
    } else {
      res.send({ success: true });
    }
  });
});

// used to advance an envelope to the next seat
router.post('/api/move-envelope', (req, res) => {
  let sql = `UPDATE ENVELOPES 
             SET seat_number = ${req.body.next_seat}, 
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

router.get('/api/start-game/:facilitator_id/:game_id', (req, res) => {
  let timestamp = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
  let sql = `UPDATE GAME
             SET start_time = '${timestamp}'
             WHERE facilitator_id = '${req.params.facilitator_id}'
             AND game_id = '${req.params.game_id}'`;
  db.query(sql, function (err, result) {
    if (err) throw err;
    if (result.changedRows !== 1) {
      res.send({ success: false });
    } else {
      res.send({ success: true });
    }
  });
});

module.exports = router;

if (module.hot) {
  module.hot.accept();
}

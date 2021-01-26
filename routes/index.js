//import Timers from '../lib/timers';
const { nanoid } = require('nanoid/non-secure');
const { Router } = require('express');
const router = Router();
const db = require('../db');
const timer = require('../lib/timers');

// number of envelopes for each team
const numEnvelopes = 20;

// number of envelopes for each batch
const batchSize = 5;

//const timer = new Timers();
// endpoint to create a game
router.get('/api/create', (req, res) => {
  let createSuccess = true;
  const session = req.universalCookies.get('session');
  // generate a game and facilitator id
  const gameId = nanoid(16);
  const facilitatorId = nanoid(16);

  // generate team ids
  const teamIds = [nanoid(16), nanoid(16)];


  // generate ids for seats
  let seatIds = []
  for (let i = 0; i < 6; i++) {
    seatIds[i] = nanoid(16);
  }

  // generate group numbers for the batch envelopes
  let groupNum = []
  let batchNum = 0;
  for (let i = 0; i < numEnvelopes; i++) {
    if (i % batchSize == 0) {
      batchNum++;
    }
    groupNum[i] = batchNum;
  }

  // insert create team skeletons
  let values = [
    [teamIds[0], 0, true],
    [teamIds[1], 0, false]
  ];
  let sql = 'INSERT INTO TEAMS (team_id, envelopes_completed, is_team_1) VALUES ?';
  db.query(sql, [values], function (err, result) {
    if (err) {
      console.log(err);
      createSuccess = false;
    }
  });

  // create game instance
  values = [[gameId, (seatIds.length / 2), facilitatorId, teamIds[0], teamIds[1], 0, 0, 0, 0, 0, session, false]];
  sql = 'INSERT INTO GAME (game_id, total_stages, facilitator_id, team_1_id, team_2_id, score_1, score_2, game_tick, team_1_completed, team_2_completed , facilitator_session, is_started) VALUES ?';
  
  db.query(sql, [values], function (err, result) {
    if (err) {
      console.log("ERROR - Unable to create game:" + err);
      createSuccess = false;
    }
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
    if (err) {
      console.log("ERROR - Unable to insert into seats: " + err);
      createSuccess = false;
    }
  });

  values = [];
  for (let i = 0; i < numEnvelopes; i++) {
    values[i] = [nanoid(16), i, 0, Math.random() * (numEnvelopes - 1) + 1, gameId, teamIds[0], 0, true, false, false];
    values[i + numEnvelopes] = [nanoid(16), groupNum[i], 0, Math.random() * (numEnvelopes - 1) + 1, gameId, teamIds[1], 0, false, false, false];
  }
  sql = 'INSERT INTO ENVELOPES (envelope_id, group_number, envelope_state, matching_stamp, game_id, team_id, seat_number, is_team_1, is_changed, prev_completed) VALUES ?';
  db.query(sql, [values], function (err, result) {
    if (err) {
      console.log("ERROR - Unable to insert into ENVELOPES: " + err);
      createSuccess = false;
    }
  });
  timer.addGame(gameId, teamIds[0], teamIds[1]);
  req.universalCookies.set('facilitatorInfo', {
    game: gameId,
    id: facilitatorId,
  }, { path: '/' });
  if (createSuccess) {
    res.send({ game: gameId, facilitator: facilitatorId, success: true });
  } else {
    res.send({ success: false });
  }
});

router.get('/api/join/:gameId', (req, res) => {
  const sql = `SELECT SEATS.seat_number, SEATS.seat_id, SEATS.is_taken, SEATS.display_name, SEATS.session_id, 
               GAME.game_id, GAME.is_started, GAME.team_1_id, GAME.team_2_id,
               TEAMS.team_id, TEAMS.is_team_1, TEAMS.team_name
               FROM SEATS 
               INNER JOIN GAME on GAME.game_id = SEATS.game_id 
               INNER JOIN TEAMS on TEAMS.team_id = SEATS.team_id 
               WHERE SEATS.game_id = ?`;

  db.query(sql, [req.params.gameId] , function (err, result) {
    if (err) {
      console.log("ERROR - Unable to select join game information: " + err);
      res.send({ game: null });
    } else if (result.length === 0 || !result || !result[0] || !result[0].game_id) {
      // handle any invalid queries
      console.log(`Game not found - in /api/join/${req.params.gameId}`);
      res.send({ game: null });
    } else {
      let summary = {};
      summary.game = result[0].game_id;
      summary.isStarted = result[0].is_started === 1 ? true : false;
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
        seat.sessionId = i.session_id;
        if (i.is_team_1 === 1) {
          summary.team1Name = i.team_name;
        } else if (i.is_team_1 === 0) {
          summary.team2Name = i.team_name;
        }
        summary.seats.push(seat);
      }
      res.send(summary);
    }
  });
});

router.get('/api/game-state/:gameId', (req, res) => {
  let sql = `SELECT envelope_id, envelope_state, seat_number, is_team_1, envelope_end, matching_stamp, is_changed, prev_completed, group_number, GAME.is_started, ENVELOPES.game_id, team_id, GAME.team_1_id, GAME.team_2_id, GAME.score_1, GAME.score_2, GAME.game_tick,
              GAME.team_1_completed, GAME.team_2_completed
             FROM ENVELOPES 
             INNER JOIN GAME ON GAME.game_id = ENVELOPES.game_id
             WHERE ENVELOPES.game_id = ?`;
  db.query(sql, [req.params.gameId], function (err, result) {
    if (err) {
      console.log("ERROR - Unable to get game-state information from db " + err);
      res.send({ success: false });
    } else if (!result || !result[0] || !result[0].game_id) {
      console.log(`Game not found - in /api/game-state/${req.params.gameId}`);
      res.send({ success: false });
    } else {
      res.send({
        team1Completed: result[0].team_1_completed,
        team2Completed: result[0].team_2_completed,
        gameId: result[0].game_id,
        startTime: result[0].start_time,
        isStarted: result[0].is_started === 1 ? true : false,
        team1: result[0].team_1_id,
        team2: result[0].team_2_id,
        score1: result[0].score_1,
        score2: result[0].score_2,
        gameTick: result[0].game_tick,
        envelopes: result.map((i) => {
          return ({
            envelopeId: i.envelope_id,
            isChanged: i.is_changed === 1 ? true : false,
            prevCompleted: i.prev_completed === 1 ? true : false,
            groupNumber: i.group_number,
            matchingStamp: i.matching_stamp,
            envelopeState: i.envelope_state,
            team: i.team_id,
            isTeam1: i.is_team_1 === 1 ? true : false,
            seatNumber: i.seat_number
          });
        })
      });
    }
  });
});

router.post('/api/set-team-name', (req, res) => {
  const session = req.universalCookies.get('session');
  const sql = `UPDATE TEAMS INNER JOIN GAME on GAME.team_1_id = team_id or GAME.team_2_id = team_id
             SET team_name = ?
             WHERE team_id = ?
             AND facilitator_session = ?`;

  db.query(sql, [req.body.teamName, req.body.teamId, session],function (err, result) {
    if (err) {
      console.log("ERROR - Unable to set team name: " + err);
      res.send({ success: false });
    } else if (result.changedRows !== 1) {
      res.send({ success: false });
    } else {
      res.send({ success: true });
    }
  });
});

router.post('/api/set-player-name', (req, res) => {
  const sql = `UPDATE SEATS
                SET display_name = ?
                WHERE seat_id = ?`;

  db.query(sql, [req.body.displayName, req.body.seatId],function (err, result) {
    if (err) {
      console.log("ERROR - Unable to set player name: " + err);
      res.send({ success: false });
    } else if (result.changedRows !== 1) {
      res.send({ success: false });
    } else {
      res.send({ success: true });
    }
  });
});

router.get('/api/choose-seat/:teamId/:seatId', (req, res) => {
  const session = req.universalCookies.get('session');
  const sql = `UPDATE SEATS SET 
             is_taken = 1, session_id = ?
             WHERE seat_id = ?
             AND team_id = ?
             AND is_taken = 0`;
  db.query(sql, [session, req.params.seatId, req.params.teamId],function (err, result) {
    if (err) {
      console.log("ERROR - Unabel to choose seat: " + err);
      res.send({ success: false });
    } else if (result.changedRows !== 1) {
      res.send({ success: false });
    } else {
      res.send({ success: true, seatId: req.params.seatId });
    }
  });
});

router.get('/api/update-envelope/:gameId/:envelopeId/:state', (req, res) => {
  const sql = `UPDATE ENVELOPES
             SET envelope_state = ?
             WHERE game_id = ?
             AND envelope_id = ?`;
  db.query(sql, [req.params.state, req.params.gameId, req.params.envelopeId],function (err, result) {
    if (err) {
      console.log("ERROR - Unable to update envelope: " + err);
      res.send({ success: false });
    } else {
      res.send({ success: true });
    }
  });

});

// used to advance an envelope to the next seat
router.post('/api/move-envelope', (req, res) => {
  const sql = `UPDATE ENVELOPES 
             SET seat_number = ?, 
                envelope_state = 0,
                prev_completed = IF( ? = 3, true, IF(prev_completed = true, true, false))
             WHERE envelope_id IN (?)`;

  db.query(sql, [req.body.nextSeat, req.body.nextSeat, req.body.envelopes], function (err, result) {
    if (err) {
      console.log("ERROR - Unable to move envelopes: " + err);
      res.send({ success: false });
    } else if (result.changedRows !== req.body.envelopes.length) {
      res.send({ success: false });
    } else {
      res.send({ success: true });
    }
  });
});

// set the chosen envelopes to changed
router.post('/api/set-changed', (req, res) => {
  const sql = `UPDATE ENVELOPES 
             SET is_changed = IF(is_changed = true, false, true)
             WHERE envelope_id IN (?)`;

  db.query(sql, [req.body.envelopes], function (err, result) {
    if (err) {
      console.log("ERROR - Unable to set changed state on envelopes: " + err);
      res.send({ success: false });
    } else if (result.changedRows !== req.body.envelopes.length) {
      res.send({ success: false });
    } else {
      res.send({ success: true });
    }
  });
});

router.get('/api/start-game/:facilitatorId/:gameId', (req, res) => {
  const session = req.universalCookies.get('session');
  const sql = `UPDATE GAME
             SET is_started = true
             WHERE facilitator_session = ?
             AND game_id = ?`;
  db.query(sql, [session, req.params.gameId], function (err, result) {
    if (err) {
      console.log("ERROR - Unable to start game timer: " + err);
      res.send({ success: false });
    } else if (result.changedRows !== 1) {
      res.send({ success: false });
    } else {
      res.send({ success: true });
      timer.startTimer(req.params.gameId);
    }
  });
});

router.get('/api/stop-game/:facilitatorId/:gameId', (req, res) => {
  const session = req.universalCookies.get('session');
  const sql = `UPDATE GAME
             SET is_started = false
             WHERE facilitator_session = ?
             AND game_id = ?`;
  db.query(sql, [session, req.params.gameId],function (err, result) {
    if (err) {
      console.log("ERROR - Unable to stop game timer: " + err);
      res.send({ success: false });
    } else if (result.changedRows !== 1) {
      res.send({ success: false });
    } else {
      res.send({ success: true });
      timer.stopTimer(req.params.gameId);
    }
  });
});

router.get('/api/remove-player/:seatId', (req, res) => {
  const facil = req.universalCookies.get('facilitatorInfo');
  const session = req.universalCookies.get('session');
  if (facil) {
    const sql = `UPDATE SEATS
             INNER JOIN GAME ON SEATS.game_id = GAME.game_id
             SET SEATS.is_taken = 0, SEATS.session_id = null, SEATS.display_name = null
             WHERE SEATS.seat_id = ?
             AND GAME.facilitator_session = ?`;
    db.query(sql, [req.params.seatId, session], function (err, result) {
      if (err) {
        console.log("ERROR - Unable to remove player: " + err);
        res.send({ success: false });
      } else if (result.changedRows === 1) {
        res.send({ success: true });
      } else {
        res.send({ success: false });
      }
    });
  }
});

router.get('/api/fill-seats', (req, res) => {
  const facil = req.universalCookies.get('facilitatorInfo');
  const session = req.universalCookies.get('session');
  if (facil) {
    const sql = `UPDATE SEATS
               INNER JOIN GAME ON SEATS.game_id = GAME.game_id
               SET is_taken = 1
               WHERE SEATS.game_id = ?
               AND GAME.facilitator_session = ?`;

    db.query(sql, [facil.game, session], function (err, result) {
      console.log("Debug Activated");
      if (err) {
        console.log("ERROR - Unable to fill seats: " + err);
        res.send({ success: false });
      } else if (result.changedRows === 0) {
        res.send({ success: false });
      } else {
        res.send({ success: true });
      }
    });
  }



});

if (module.hot) {
  module.hot.accept();
}

module.exports = router;


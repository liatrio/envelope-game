const { nanoid } = require('nanoid/non-secure');
const { Router } = require('express');
const router = Router();
const db = require('../db');
const num_env = 20;

router.get('/foo', (req, res) => res.send('Hello world!'));

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
    console.log('inserting into team');
    let values = [
        [team_ids[0], 0, true],
        [team_ids[1], 0, false]
    ];
    let sql = 'INSERT INTO TEAMS (team_id, envelopes_completed, is_team_1) VALUES ?';
    db.query(sql, [values], function (err, result) {
        if (err) throw err;
        console.log("Number of records inserted: " + result.affectedRows);
    });

    // create game instance
    console.log('inserting into game');
    values = [
        [game_id, (seat_ids.length / 2), facilitator_id, team_ids[0], team_ids[1]]
    ];
    sql = 'INSERT INTO GAME (game_id, total_stages, facilitator_id, team_1_id, team_2_id) VALUES ?';
    db.query(sql, [values], function (err, result) {
        if (err) throw err;
        console.log("Number of records inserted: " + result.affectedRows);
    });

    console.log('inserting into seats');
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
        console.log("Number of records inserted: " + result.affectedRows);
    });

    console.log('inserting into envelopes');
    values = [];
    for (let i = 0; i < num_env; i++) {
        values[i] = [nanoid(16), 0, Math.random() * (num_env - 1) + 1, game_id, team_ids[0]]
        values[i + num_env] = [nanoid(16), 0, Math.random() * (num_env - 1) + 1, game_id, team_ids[1]]
    }
    sql = 'INSERT INTO ENVELOPES (envelope_id, envelope_state, matching_stamp, game_id, team_id) VALUES ?';
    db.query(sql, [values], function (err, result) {
        if (err) throw err;
        console.log("Number of records inserted: " + result.affectedRows);
    });

    res.send({game: game_id, facilitator: facilitator_id});
});

module.exports = router;

if (module.hot) {
    module.hot.accept();
}

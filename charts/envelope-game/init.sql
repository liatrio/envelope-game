/*
Define tables needed 
*/
CREATE TABLE IF NOT EXISTS TEAMS
(
  team_id VARCHAR(16) NOT NULL,
  envelopes_completed INT NOT NULL,
  team_name VARCHAR(32),
  is_team_1 BOOLEAN NOT NULL,
  finish_time DATETIME,
  PRIMARY KEY (team_id)
);

CREATE TABLE IF NOT EXISTS GAME
(
  game_id VARCHAR(16) NOT NULL,
  is_started BOOLEAN NOT NULL,
  total_stages INT NOT NULL,
  game_tick INT NOT NULL,
  facilitator_id VARCHAR(21) NOT NULL,
  facilitator_session VARCHAR(21) NOT NULL,
  team_1_id VARCHAR(16) NOT NULL,
  team_2_id VARCHAR(16) NOT NULL,
  team_1_completed INT NOT NULL,
  team_2_completed INT NOT NULL,
  score_1 INT NOT NULL,
  score_2 INT NOT NULL,
  PRIMARY KEY (game_id),
  FOREIGN KEY (team_1_id) REFERENCES TEAMS(team_id),
  FOREIGN KEY (team_2_id) REFERENCES TEAMS(team_id),
  UNIQUE (team_1_id),
  UNIQUE (team_2_id)
);

CREATE TABLE IF NOT EXISTS SEATS
(
  seat_number INT NOT NULL,
  seat_id VARCHAR(16) NOT NULL,
  envelopes_completed INT NOT NULL,
  envelopes_ready INT NOT NULL,
  is_taken BOOLEAN NOT NULL,
  display_name VARCHAR(16),
  game_id VARCHAR(16) NOT NULL,
  team_id VARCHAR(16) NOT NULL,
  session_id VARCHAR(21),
  PRIMARY KEY (seat_id),
  FOREIGN KEY (game_id) REFERENCES GAME(game_id),
  FOREIGN KEY (team_id) REFERENCES TEAMS(team_id)
);

CREATE TABLE IF NOT EXISTS ENVELOPES
(
  seat_number INT NOT NULL,
  group_number INT NOT NULL,
  envelope_id VARCHAR(16) NOT NULL,
  envelope_state INT NOT NULL,
  matching_stamp INT NOT NULL,
  prev_completed BOOLEAN NOT NULL,
  envelope_start DATETIME,
  envelope_end DATETIME,
  team_id VARCHAR(16) NOT NULL,
  game_id VARCHAR(16) NOT NULL,
  is_team_1 BOOLEAN NOT NULL,
  is_changed BOOLEAN NOT NULL,
  PRIMARY KEY (envelope_id),
  FOREIGN KEY (team_id) REFERENCES TEAMS(team_id),
  FOREIGN KEY (game_id) REFERENCES GAME(game_id)
);

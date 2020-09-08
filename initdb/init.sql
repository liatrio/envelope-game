/*
Define tables needed 
*/
CREATE TABLE TEAMS
(
  team_id VARCHAR(16) NOT NULL,
  envelopes_completed INT NOT NULL,
  team_name VARCHAR(32),
  is_team_1 BOOLEAN NOT NULL,
  finish_time DATE,
  PRIMARY KEY (team_id)
);

CREATE TABLE GAME
(
  game_id VARCHAR(16) NOT NULL,
  start_time DATE,
  total_stages INT NOT NULL,
  facilitator_id VARCHAR(16) NOT NULL,
  team_1_id VARCHAR(16) NOT NULL,
  team_2_id VARCHAR(16) NOT NULL,
  PRIMARY KEY (game_id),
  FOREIGN KEY (team_1_id) REFERENCES TEAMS(team_id),
  FOREIGN KEY (team_2_id) REFERENCES TEAMS(team_id),
  UNIQUE (team_1_id),
  UNIQUE (team_2_id)
);

CREATE TABLE SEATS
(
  seat_number INT NOT NULL,
  seat_id VARCHAR(16) NOT NULL,
  envelopes_completed INT NOT NULL,
  envelopes_ready INT NOT NULL,
  is_taken BOOLEAN NOT NULL,
  display_name VARCHAR(16),
  game_id VARCHAR(16) NOT NULL,
  team_id VARCHAR(16) NOT NULL,
  PRIMARY KEY (seat_id),
  FOREIGN KEY (game_id) REFERENCES GAME(game_id),
  FOREIGN KEY (team_id) REFERENCES TEAMS(team_id)
);

CREATE TABLE ENVELOPES
(
  envelope_id VARCHAR(16) NOT NULL,
  envelope_state INT NOT NULL,
  matching_stamp INT NOT NULL,
  envelope_start DATE,
  envelope_end DATE,
  seat_id VARCHAR(16),
  PRIMARY KEY (envelope_id),
  FOREIGN KEY (seat_id) REFERENCES SEATS(seat_id)
);
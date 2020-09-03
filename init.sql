/*
Cleanup any remaining tables or databases
*/
DROP DATABASE IF EXISTS envelope_game
CREATE DATABASE envelope_game
USE envelope_game

DROP TABLE IF EXISTS TEAMS
DROP TABLE IF EXISTS GAME
DROP TABLE IF EXISTS PLAYERS
DROP TABLE IF EXISTS STAGE

/*
Define tables needed
*/
CREATE TABLE TEAMS
(
  team_id INT NOT NULL,
  envelopes_completed INT NOT NULL,
  team_name VARCHAR(32) NOT NULL,
  is_team_1 INT NOT NULL,
  finish_time DATE NOT NULL,
  PRIMARY KEY (team_id)
);

CREATE TABLE GAME
(
  game_id INT NOT NULL,
  start_time DATE NOT NULL,
  total_stages INT NOT NULL,
  team_1_id INT NOT NULL,
  team_2_id INT NOT NULL,
  PRIMARY KEY (game_id),
  FOREIGN KEY (team_1_id) REFERENCES TEAMS(team_id),
  FOREIGN KEY (team_2_id) REFERENCES TEAMS(team_id),
  UNIQUE (team_1_id),
  UNIQUE (team_2_id)
);

CREATE TABLE PLAYERS
(
  seat INT NOT NULL,
  player_id INT NOT NULL,
  display_name INT NOT NULL,
  game_id INT NOT NULL,
  team_id INT NOT NULL,
  PRIMARY KEY (player_id),
  FOREIGN KEY (game_id) REFERENCES GAME(game_id),
  FOREIGN KEY (team_id) REFERENCES TEAMS(team_id)
);

CREATE TABLE STAGE
(
  envelopes_completed_stage INT NOT NULL,
  envelopes_ready_stage INT NOT NULL,
  team_id INT NOT NULL,
  seat INT NOT NULL,
  PRIMARY KEY (team_id, seat),
  FOREIGN KEY (team_id) REFERENCES TEAMS(team_id),
  FOREIGN KEY (seat) REFERENCES PLAYERS(seat)
);

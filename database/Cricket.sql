CREATE DATABASE IF NOT EXISTS Localcric;
USE Localcric;

-- USERS
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    reset_token VARCHAR(64) DEFAULT NULL,
    reset_token_expiry DATETIME DEFAULT NULL
);

-- TEAMS
CREATE TABLE teams (
    id INT AUTO_INCREMENT PRIMARY KEY,
    TeamName VARCHAR(100),
    playerCount INT
);

-- PLAYERS
CREATE TABLE players (
    Player_id INT AUTO_INCREMENT PRIMARY KEY,
    playerName VARCHAR(50) NOT NULL,
    playerrole VARCHAR(100),
    admin_id INT,
    FOREIGN KEY (admin_id) REFERENCES users(id)
);

-- MATCHES
CREATE TABLE matches (
    id INT AUTO_INCREMENT PRIMARY KEY,
    team1_name VARCHAR(100) NOT NULL,
    team2_name VARCHAR(100) NOT NULL,
    overs INT NOT NULL,
    match_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    admin_id INT,
    FOREIGN KEY (admin_id) REFERENCES users(id)
);

-- MATCH PLAYERS
CREATE TABLE match_players (
    id INT AUTO_INCREMENT PRIMARY KEY,
    match_id INT NOT NULL,
    player_id INT NOT NULL,
    team_side VARCHAR(10) NOT NULL,
    FOREIGN KEY (match_id) REFERENCES matches(id),
    FOREIGN KEY (player_id) REFERENCES players(Player_id)
);

-- BATTING RECORDS
CREATE TABLE batting_records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    match_id INT NOT NULL,
    player_id INT NOT NULL,
    runs INT DEFAULT 0,
    balls INT DEFAULT 0,
    fours INT DEFAULT 0,
    sixes INT DEFAULT 0,
    FOREIGN KEY (match_id) REFERENCES matches(id),
    FOREIGN KEY (player_id) REFERENCES players(Player_id)
);

-- BOWLING RECORDS
CREATE TABLE bowling_records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    match_id INT NOT NULL,
    player_id INT NOT NULL,
    overs DECIMAL(4,1) DEFAULT 0,
    runs_given INT DEFAULT 0,
    wickets INT DEFAULT 0,
    FOREIGN KEY (match_id) REFERENCES matches(id),
    FOREIGN KEY (player_id) REFERENCES players(Player_id)
);

-- MATCH RESULTS
CREATE TABLE match_results (
    id INT AUTO_INCREMENT PRIMARY KEY,
    match_id INT NOT NULL,
    team1_score INT,
    team1_wickets INT,
    team2_score INT,
    team2_wickets INT,
    winner VARCHAR(100),
    FOREIGN KEY (match_id) REFERENCES matches(id)
);
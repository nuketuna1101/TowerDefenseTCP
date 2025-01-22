CREATE TABLE IF NOT EXISTS userTable
(
    id            INT PRIMARY KEY AUTO_INCREMENT,
    email         VARCHAR(255) UNIQUE NOT NULL,
    nickname      VARCHAR(255) NOT NULL,
    password      VARCHAR(255) NOT NULL,
    createAt      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    lastLoginTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS userScore
(
    id        INT PRIMARY KEY AUTO_INCREMENT,
    highScore INT DEFAULT 0,
    FOREIGN KEY (id) REFERENCES userTable (id)
);

CREATE TABLE IF NOT EXISTS MatchHistoryTable
(
    id          INT PRIMARY KEY AUTO_INCREMENT,
    player1     INT NOT NULL,
    player2     INT NOT NULL,
    winPlayer   INT NOT NULL,
    player1Score INT DEFAULT 0,
    player2Score INT DEFAULT 0,
    timestamp   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (player1) REFERENCES userTable (id),
    FOREIGN KEY (player2) REFERENCES userTable (id),
    FOREIGN KEY (winPlayer) REFERENCES userTable (id)
);

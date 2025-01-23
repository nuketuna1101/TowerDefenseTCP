-- user_db.sql
-- 테이블이 이미 존재한다면 삭제
DROP TABLE IF EXISTS userScore;
DROP TABLE IF EXISTS userTable;

-- userTable 다시 생성
CREATE TABLE IF NOT EXISTS userTable
(
    id            INT PRIMARY KEY AUTO_INCREMENT,
    username      VARCHAR(255) UNIQUE NOT NULL,  -- 로그인 아이디
    email         VARCHAR(255) UNIQUE NOT NULL,  -- 이메일
    password      VARCHAR(255) NOT NULL,         -- 비밀번호
    createAt      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    lastLoginTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- userScore 테이블 생성
CREATE TABLE IF NOT EXISTS userScore
(
    userId    INT PRIMARY KEY,
    highScore INT DEFAULT 0,
    FOREIGN KEY (userId) REFERENCES userTable (id)
);

-- MatchHistoryTable 생성 (필요한 경우)
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
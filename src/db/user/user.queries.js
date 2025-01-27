// user.queries.js
export const SQL_QUERIES = {
  FIND_USER_BY_USERNAME: 'SELECT * FROM userTable WHERE username = ?',
  FIND_USER_BY_EMAIL: 'SELECT * FROM userTable WHERE email = ?',
  CREATE_USER: 'INSERT INTO userTable (username, email, password) VALUES (?, ?, ?)',
  CREATE_USER_SCORE: 'INSERT INTO userScore (userId, highScore) VALUES (?, ?)',
  UPDATE_USER_LOGIN: 'UPDATE userTable SET lastLoginTime = CURRENT_TIMESTAMP WHERE username = ?',
  UPDATE_USER_PASSWORD: 'UPDATE userTable SET password = ? WHERE username = ?',
  UPDATE_HIGH_SCORE:
    'INSERT INTO userScore (userId, highScore) VALUES (?, ?) ON DUPLICATE KEY UPDATE highScore = GREATEST(highScore, ?)',
  CREATE_MATCH_HISTORY:
    'INSERT INTO MatchHistoryTable (player1, player2, winPlayer, player1Score, player2Score) VALUES (?, ?, ?, ?, ?)',
  FIND_USER_HIGH_SCORE: 'SELECT highScore FROM userScore WHERE userId = ?',
};

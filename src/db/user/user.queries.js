// user.queries.js
export const SQL_QUERIES = {
  FIND_USER_BY_USERNAME: 'SELECT * FROM userTable WHERE username = ?',
  FIND_USER_BY_EMAIL: 'SELECT * FROM userTable WHERE email = ?',
  CREATE_USER: 'INSERT INTO userTable (username, email, password) VALUES (?, ?, ?)',
  UPDATE_USER_LOGIN: 'UPDATE userTable SET lastLoginTime = CURRENT_TIMESTAMP WHERE id = ?',
  UPDATE_USER_PASSWORD: 'UPDATE userTable SET password = ? WHERE id = ?'
};
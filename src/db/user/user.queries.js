// user.queries.js
export const SQL_QUERIES = {
  FIND_USER_BY_ID: 'SELECT * FROM userTable WHERE id = ?',
  FIND_USER_BY_EMAIL: 'SELECT * FROM userTable WHERE email = ?',
  CREATE_USER: 'INSERT INTO userTable (id, email, password) VALUES (?, ?, ?)',
  UPDATE_USER_LOGIN: 'UPDATE userTable SET lastLoginTime = CURRENT_TIMESTAMP WHERE id = ?'
};
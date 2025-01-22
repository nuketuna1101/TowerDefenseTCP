export const SQL_QUERIES = {
  FIND_USER_BY_DEVICE_ID: 'SELECT * FROM userTable WHERE device_id = ?',
  CREATE_USER: 'INSERT INTO userTable (email, nickname, password) VALUES (?, ?, ?)',
  UPDATE_USER_LOGIN: 'UPDATE userTable SET lastLoginTime = CURRENT_TIMESTAMP WHERE id = ?',
  FIND_USER_BY_EMAIL: 'SELECT * FROM userTable WHERE email = ?',
  FIND_USER_BY_ID: 'SELECT * FROM userTable WHERE id = ?',
};

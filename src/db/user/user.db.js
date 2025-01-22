// user.db.js
import pools from '../database.js';
import { SQL_QUERIES } from './user.queries.js';
import { toCamelCase } from '../../utils/transformCase.js';
import bcrypt from 'bcrypt';

export const findUserByUsername = async (username) => {
  const [rows] = await pools.USER_DB.query(SQL_QUERIES.FIND_USER_BY_USERNAME, [username]);
  return toCamelCase(rows[0]);
};

export const createUser = async ({ username, email, password }) => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const [result] = await pools.USER_DB.query(SQL_QUERIES.CREATE_USER, [
    username,
    email,
    hashedPassword
  ]);

  return {
    id: result.insertId,
    username,
    email
  };
};

export const updateUserLogin = async (id) => {
  await pools.USER_DB.query(SQL_QUERIES.UPDATE_USER_LOGIN, [id]);
};

export const findUserByEmail = async (email) => {
  const [rows] = await pools.USER_DB.query(SQL_QUERIES.FIND_USER_BY_EMAIL, [email]);
  return toCamelCase(rows[0]);
};

export const validatePassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

export const findUserByDeviceId = async (deviceId) => {
  const [rows] = await pools.USER_DB.query(SQL_QUERIES.FIND_USER_BY_DEVICE_ID, [deviceId]);
  return toCamelCase(rows[0]);
};

export const createInitialUser = async (deviceId) => {
  const [result] = await pools.USER_DB.query(SQL_QUERIES.CREATE_INITIAL_USER, [deviceId]);
  return {
    id: result.insertId,
    deviceId
  };
};


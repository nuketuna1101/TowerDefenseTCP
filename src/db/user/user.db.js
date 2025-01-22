//user.db.js
import { v4 as uuidv4 } from 'uuid';
import pools from '../database.js';
import { SQL_QUERIES } from './user.queries.js';
import { toCamelCase } from '../../utils/transformCase.js';

export const findUserByDeviceID = async (deviceId) => {
  const [rows] = await pools.USER_DB.query(SQL_QUERIES.FIND_USER_BY_DEVICE_ID, [deviceId]);
  return toCamelCase(rows[0]);
};

export const createUser = async ({ id, email, password }) => {
  const [result] = await pools.USER_DB.query(SQL_QUERIES.CREATE_USER, [
    email,
    id, // nickname으로 사용
    password,
  ]);
  return { id: result.insertId, email, nickname: id };
};

export const findUserByEmail = async (email) => {
  const [rows] = await pools.USER_DB.query(SQL_QUERIES.FIND_USER_BY_EMAIL, [email]);
  return toCamelCase(rows[0]);
};

export const findUserById = async (id) => {
  const [rows] = await pools.USER_DB.query(SQL_QUERIES.FIND_USER_BY_ID, [id]);
  return toCamelCase(rows[0]);
};

export const updateUserLogin = async (id) => {
  await pools.USER_DB.query(SQL_QUERIES.UPDATE_USER_LOGIN, [id]);
};

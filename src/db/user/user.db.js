// user.db.js
import pools from '../database.js';
import { SQL_QUERIES } from './user.queries.js';
import { toCamelCase } from '../../utils/transformCase.js';
import bcrypt from 'bcrypt';

export const findUserByUsername = async (username) => {
  console.log('사용자 정보:', username);
  const [rows] = await pools.USER_DB.query(SQL_QUERIES.FIND_USER_BY_USERNAME, [username]);
  return toCamelCase(rows[0]);
};

export const createUser = async ({ username, email, password }) => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const [result] = await pools.USER_DB.query(SQL_QUERIES.CREATE_USER, [
    username,
    email,
    hashedPassword,
  ]);

  //#region 유저 생성 시 유저 점수 테이블도 생성

  // 유저 id 찾기 위해
  const user = pools.USER_DB.query(SQL_QUERIES.FIND_USER_BY_USERNAME, [username]);
  // 테이블 생성
  await pools.USER_DB.query(SQL_QUERIES.CREATE_USER_SCORE, [user.id, 0 /* default 점수값 */]);

  //#endregion


  return {
    id: result.insertId,
    username,
    email,
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
  //return plainPassword === hashedPassword;
};

export const findUserByDeviceId = async (deviceId) => {
  const [rows] = await pools.USER_DB.query(SQL_QUERIES.FIND_USER_BY_DEVICE_ID, [deviceId]);
  return toCamelCase(rows[0]);
};

export const createInitialUser = async (deviceId) => {
  const [result] = await pools.USER_DB.query(SQL_QUERIES.CREATE_INITIAL_USER, [deviceId]);
  return {
    id: result.insertId,
    deviceId,
  };
};

// 최대점수 추가

export const updateHighScore = async (userId, score) => {
  try {
    const [result] = await pools.USER_DB.query(SQL_QUERIES.UPDATE_HIGH_SCORE, [
      userId,
      score,
      score,
    ]);
    return result;
  } catch (error) {
    console.error('Error updating high score:', error);
    throw error;
  }
};

export const findUserHighScore = async (userId) => {
  try {
    const highScore = await pools.USER_DB.query(SQL_QUERIES.FIND_USER_HIGH_SCORE, [userId]);
    return highScore;
  } catch (error) {
    console.error('Error finding user high score:', error);
    throw error;
  }
}

//매치 기록 추가
export const createMatchHistory = async (
  player1Id,
  player2Id,
  winnerId,
  player1Score,
  player2Score,
) => {
  try {
    const [result] = await pools.USER_DB.query(SQL_QUERIES.CREATE_MATCH_HISTORY, [
      player1Id,
      player2Id,
      winnerId,
      player1Score,
      player2Score,
    ]);
    return result;
  } catch (error) {
    console.error('Error creating match history:', error);
    throw error;
  }
};

//user.session.js
import { removeUserSessions, userSessions } from './sessions.js';
import User from '../classes/models/user.class.js';
import { testLog } from '../utils/testLogger.js';

export const addUser = (id, socket) => {
  const user = new User(id, socket);
  userSessions.push(user);
  //console.log('로그인된 유저가 있는데 : ' + id, socket);
  return user;
};

export const removeUser = (socket) => {
  const index = userSessions.findIndex((user) => user.socket === socket);
  if (index !== -1) {
    removeUserSessions.push(userSessions[index]);
    return userSessions.splice(index, 1)[0];
  }
};

export const getUserById = (id) => {
  return userSessions.find((user) => user.id === id);
};

export const getUserBySocket = (socket) => {
  return userSessions.find((user) => user.socket === socket);
};

export const getNextSequence = (id) => {
  const user = getUserById(id);
  if (user) {
    return user.getNextSequence();
  }
  return null;
};

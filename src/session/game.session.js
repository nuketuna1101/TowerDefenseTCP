//game.session.js
import { gameSessions } from './sessions.js';
import Game from '../classes/models/game.class.js';

// gameId로 만들어짐
export const addGameSession = (id) => {
  // 새로운 게임 세션 생성
  const session = new Game(id);
  // 전역 세션 배열에 추가
  gameSessions.push(session);
  // 생성된 세션 반환
  return session;
};

export const removeGameSession = (id) => {
  const index = gameSessions.findIndex((session) => session.id === id);
  if (index !== -1) {
    if(gameSessions[index].users[0] != undefined) gameSessions[index].users[0].userInitialize();
    if(gameSessions[index].users[1] != undefined) gameSessions[index].users[1].userInitialize();
    return gameSessions.splice(index, 1)[0];
  }
};

export const getGameSession = (id) => {
  return gameSessions.find((session) => session.id === id);
};

export const getGameByUser = (user) => {
  return gameSessions.find((user) => (user.users[0].id === user.id || user.users[1].id === user.id));
};

export const getAllGameSessions = () => {
  return gameSessions;
};


//#region Notify 위해 userId로 해당 유저가 속한 game 세션 찾기
export const getGameByUserId = (userId) => {
  return gameSessions.find((user) => (user.users[0].id === userId || user.users[1].id === userId));
};
//#endregion
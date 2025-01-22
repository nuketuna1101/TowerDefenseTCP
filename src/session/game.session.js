import { gameSessions } from './sessions.js';
import Game from '../classes/models/game.class.js';

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

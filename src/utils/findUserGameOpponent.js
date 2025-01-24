import { getUserBySocket } from '../session/user.session.js';
import { getGameByUser } from '../session/game.session.js';
import { testLog } from './testLogger.js';

export const findUserGameOpponentBySocket = (socket) => {
  const user = getUserBySocket(socket);
  if (!user) {
    throw new Error('유저를 찾을 수 없습니다.');
  }

  const game = getGameByUser(user);

  if (!game) {
    throw new Error('게임을 찾을 수 없습니다.');
  }

  const opponent = game.users.find((u) => u.id !== user.id);

  if (!opponent) {
    throw new Error('상대방을 찾을 수 없습니다.');
  }

  return [user, game, opponent];
};

export default findUserGameOpponentBySocket;

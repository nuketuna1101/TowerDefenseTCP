import { getUserBySocket } from '../session/user.session.js';
import { getGameByUser } from '../session/game.session.js';
import { testLog } from './testLogger.js';

export const findUserGameOpponentBySocket = (socket) => {
  const user = getUserBySocket(socket);
  // testLog(
  //   0,
  //   `findUserGameOpponentBySocket에 user 있을까? ${user}  socketId 는 있을까? ${socket.id}`,
  //   'yellow',
  // );
  let game;
  let opponent;
  if (!user) {
    throw new Error('유저를 찾을 수 없습니다.');
  }
  testLog(0, `userid ${user.id}`);
  if (user !== undefined) {
    game = getGameByUser(user);
    // testLog(0, `findUserGameOpponentByUser에 game 있을까?${game}`, 'green');
    if (!game) {
      throw new Error('게임을 찾을 수 없습니다.');
    }
    opponent = game.users.find((u) => u.id !== user.id);
    // testLog(0, `findUserGameOpponentByUser에 opponent 있을까?${opponent}`, 'red');
    if (!opponent) {
      throw new Error('상대방을 찾을 수 없습니다.');
    }
  }
  return { user, game, opponent };
};

export default findUserGameOpponentBySocket;
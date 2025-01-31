//onEnd.js
import { removeUser, getUserBySocket } from '../session/user.session.js';
import { getHandlerById } from '../handlers/index.js';
import { getGameByUser } from '../session/game.session.js';

export const onEnd = (socket) => () => {
  console.log('클라이언트 연결이 종료되었습니다.');
  const user = getUserBySocket(socket);
  const gameSession = getGameByUser(user);
  if (gameSession) {
    console.log('게임 세션이 종료되었습니다.');
    const handler = getHandlerById(18);
    handler({
      user: user,
    });
  }
  removeUser(socket);
};

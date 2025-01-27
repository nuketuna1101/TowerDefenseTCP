//onEnd.js
import { getHandlerById } from '../handlers/index.js';
import { getGameByUser } from '../session/game.session.js';
import { getUserBySocket, removeUser } from '../session/user.session.js';

export const onEnd = (socket) => () => {
  console.log('클라이언트 연결이 종료되었습니다.');
  const user = getUserBySocket(socket);
  const gameSession = getGameByUser(user);
  if (gameSession) {
    const handler = getHandlerById(18);
    handler({
      user: user,
    });
  }
  removeUser(socket);
};

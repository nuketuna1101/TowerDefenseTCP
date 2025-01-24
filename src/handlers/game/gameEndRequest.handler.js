import { handleError } from '../../utils/error/errorHandler.js';
import { createS2CGameOverNotificationPacket } from '../../utils/notification/game.notification.js';
import { getGameByUser } from '../../session/game.session.js';

//게임 종료 요청 (게임 나가거나 패배했을때?)
const gameEndRequestHandler = ({ socket, userId, payload, user, game }) => {
  try {
    const users = game.users;

    // 검증이 필요할 수도 있음음

    if (users[1].id !== user.id)
      users[0].socket.write(createS2CGameOverNotificationPacket(users[0], true));
    else users[1].socket.write(createS2CGameOverNotificationPacket(users[1], true));
    removeGameSession(game.id);
  } catch (error) {
    handleError(user.socket, error);
  }
};

export default gameEndRequestHandler;

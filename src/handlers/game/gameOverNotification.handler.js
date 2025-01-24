import { handleError } from '../../utils/error/errorHandler.js';
import { createS2CGameOverNotificationPacket } from '../../utils/notification/game.notification.js';
import { getGameByUser } from '../../session/game.session.js';
import { removeGameSession } from '../../session/game.session.js';

//게임 종료 알림 (패배 유저로 호출출)
const updategameOverNotificationHandler = ({ user }) => {
  try {
    const gameSession = getGameByUser(user).users;
    const users = gameSession.users;

    users[0].socket.write(createS2CGameOverNotificationPacket(users[0], users[0].id !== user.id));
    users[1].socket.write(createS2CGameOverNotificationPacket(users[1], users[0].id === user.id));

    removeGameSession(gameSession.id);
  } catch (error) {
    handleError(user.socket, error);
  }
};

export default updategameOverNotificationHandler;

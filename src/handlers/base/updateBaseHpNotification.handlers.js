import { handleError } from '../../utils/error/errorHandler.js';
import { createS2CUpdateBaseHPNotificationPacket } from '../../utils/notification/game.notification.js';
import { getGameByUser } from '../../session/game.session.js';
import { testLog } from '../../utils/testLogger.js';

const updateBaseHpNotificationHandler = ({ user }) => {
  try {
    const gameSession = getGameByUser(user);
    if (gameSession) {
      const users = gameSession.users;
      users[0].socket.write(
        createS2CUpdateBaseHPNotificationPacket(user, users[1].id === user.id),
      );
      users[1].socket.write(
        createS2CUpdateBaseHPNotificationPacket(user, users[0].id === user.id),
      );
    }
  } catch (error) {
    handleError(user.socket, error);
  }
};

export default updateBaseHpNotificationHandler;

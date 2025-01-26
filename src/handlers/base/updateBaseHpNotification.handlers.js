
import { handleError } from '../../utils/error/errorHandler.js';
import { createS2CUpdateBaseHPNotificationPacket } from '../../utils/notification/game.notification.js';
import { getGameByUser } from '../../session/game.session.js';

const updateBaseHpNotificationHandler = ({ user }) => {
  try {
    const users = getGameByUser(user);
    users[0].socket.write(createS2CUpdateBaseHPNotificationPacket(users[0], users[0].id === user.id));
    users[1].socket.write(createS2CUpdateBaseHPNotificationPacket(users[1], users[0].id !== user.id));
  } catch (error) {
    handleError(user.socket, error);
  }
};



export default updateBaseHpNotificationHandler;
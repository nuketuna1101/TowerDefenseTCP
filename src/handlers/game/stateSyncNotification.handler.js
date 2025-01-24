import { getGameSession } from '../../session/game.session.js';
import { handleError } from '../../utils/error/errorHandler.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import { createS2CStateSyncNotificationPacket } from '../../utils/notification/game.notification.js';

const stateSyncNotificationHandler = ({ socket, userId, payload, user }) => {
  try {
    const packet = createS2CStateSyncNotificationPacket(user);

    socket.write(packet);
  } catch (error) {
    handleError(socket, error);
  }
};



export default stateSyncNotificationHandler;

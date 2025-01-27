import { handleError } from '../../utils/error/errorHandler.js';
import { createS2CUpdateBaseHPNotificationPacket } from '../../utils/notification/game.notification.js';
import { getGameByUser } from '../../session/game.session.js';

const monsterAttackBaseRequestHandler = ({socket, userId, payload, user, game}) => {
  try {
    const {damage} = payload;

    user.substractBaseHp(damage);
  } catch (error) {
    handleError(user.socket, error);
  }
};

export default monsterAttackBaseRequestHandler;

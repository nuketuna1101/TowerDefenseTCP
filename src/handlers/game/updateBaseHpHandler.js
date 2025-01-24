import { handleError } from '../../utils/error/errorHandler.js';
import { findUserGameOpponentByUser } from '../../utils/findUserGameOpponent.js';

const updateBaseHpHandler = ({ socket, payload }) => {
  try {
    const damage = payload;
    const { user } = findUserGameOpponentByUser(socket);

    user.baseHp -= damage;
    console.log(`user base HP: ${baseHp}`);
  } catch (error) {
    handleError(socket, error);
  }
};

export default updateBaseHpHandler;

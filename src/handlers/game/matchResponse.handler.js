//createGame.handler.js
import { handleError } from '../../utils/error/errorHandler.js';
import { getUserById } from '../../session/user.session.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import { craeteS2CMatchStartNotificationPacket } from '../../utils/notification/game.notification.js';
import { testLog } from '../../utils/testLogger.js';

const matchResponseHandler = ({ socket, userId, payload, gameSession }) => {
  try {
    // 현재 사용자 정보 가져오기
    const user = getUserById(userId);
    if (!user) {
      throw new CustomError(ErrorCodes.USER_NOT_FOUND, '유저를 찾을 수 없습니다.');
    }

    // 게임 세션에 사용자 추가
    gameSession.addUser(user);
    gameSession.createPath();
    testLog(0, `게임 세션 패스 생성: ${gameSession.path}`, 'blue');

    const matchPacket = craeteS2CMatchStartNotificationPacket(gameSession, user);

    // 클라에게 응답 전송
    socket.write(matchPacket);
  } catch (error) {
    handleError(socket, error);
  }
};

export default matchResponseHandler;
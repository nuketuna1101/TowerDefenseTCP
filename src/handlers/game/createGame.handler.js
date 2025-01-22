import { v4 as uuidv4 } from 'uuid';
import { addGameSession } from '../../session/game.session.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { handleError } from '../../utils/error/errorHandler.js';
import { HANDLER_IDS, RESPONSE_SUCCESS_CODE } from '../../constants/handlerIds.js';
import { getUserById } from '../../session/user.session.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';

const createGameHandler = ({ socket, userId, payload, additionalUsers = [] }) => {
  try {
    // 새로운 게임 ID 생성
    const gameId = uuidv4();
    // 게임 세션 생성
    const gameSession = addGameSession(gameId);

    // 현재 사용자 정보 가져오기
    const user = getUserById(userId);
    if (!user) {
      throw new CustomError(ErrorCodes.USER_NOT_FOUND, '유저를 찾을 수 없습니다.');
    }
    // 게임 세션에 사용자 추가
    gameSession.addUser(user);

    // 현재 사용자 id 저장
    const addedUserIds = [userId];
    additionalUsers.forEach((additionalUserId) => {
      const additionalUser = getUserById(additionalUserId);
      if(additionalUser) {
        // 매칭 잡힌 사용자 게임 세션에 추가
        gameSession.addUser(additionalUser);
        // 매칭 잡힌 사용자 id 저장
        addedUserIds.push(additionalUserId);
      }
    });

    const createGameResponse = createResponse(
      HANDLER_IDS.CREATE_GAME,
      RESPONSE_SUCCESS_CODE,
      { 
        // 생성 된 게임 id
        gameId, 
        // 게임에 참여한 사용자들의 id
        userIds: addedUserIds,
        message: '게임이 생성되었습니다.'
       },
      // 응답을 보낸 사용자 id
      userId,
    );

    // 클라에게 응답 전송
    socket.write(createGameResponse);
  } catch (error) {
    handleError(socket, error);
  }
};

export default createGameHandler;

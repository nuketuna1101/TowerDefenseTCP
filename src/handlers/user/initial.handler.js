// initial.handler.js
import { addUser } from '../../session/user.session.js';
import { HANDLER_IDS, RESPONSE_SUCCESS_CODE } from '../../constants/handlerIds.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { handleError } from '../../utils/error/errorHandler.js';
import { createInitialUser, findUserByDeviceId } from '../../db/user/user.db.js';

const initialHandler = async ({ socket, userId, payload }) => {
  try {
    console.log('=== 초기 연결 처리 시작 ===');
    const { deviceId } = payload;
    console.log('디바이스 ID:', deviceId);

    let user = await findUserByDeviceId(deviceId);

    if (!user) {
      // 새로운 사용자 생성
      user = await createUser(deviceId);
    } else {
      // 기존 사용자 로그인 정보 업데이트
      await updateUserLogin(user.id);
      console.log('기존 유저 로그인:', user);
    }

    // 세션에 사용자 추가
    addUser(user.id, socket);

    const response = createResponse(
      HANDLER_IDS.INITIAL,
      RESPONSE_SUCCESS_CODE,
      { userId: user.id },
      user.id,
    );

    socket.write(response);
  } catch (error) {
    console.error('초기 연결 처리 중 오류:', error);
    handleError(socket, error);
  }
};

export default initialHandler;

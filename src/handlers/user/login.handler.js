// login.handler.js
import { HANDLER_IDS } from '../../constants/handlerIds.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { handleError } from '../../utils/error/errorHandler.js';
import { findUserByUsername, validatePassword, updateUserLogin } from '../../db/user/user.db.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import { getUserBySocket } from '../../session/user.session.js';
import { userSessions } from '../../session/sessions.js';

const loginHandler = async ({ socket, userId, payload, user }) => {
  console.log('=== 로그인 처리 시작 ===');
  try {
    const { id, password } = payload;
    console.log('로그인 시도:', { id });

    // 사용자 찾기 (username으로 검색)
    const databaseUser = await findUserByUsername(id);
    console.log('DB에서 가져온 사용자:', databaseUser);

    if (!databaseUser) {
      throw new CustomError(ErrorCodes.USER_NOT_FOUND, '사용자를 찾을 수 없습니다.');
    }

    // 중복 로그인 체크
    const existingUser = userSessions.find((session) => session.id === id);
    if (existingUser) {
      throw new CustomError(
        ErrorCodes.ALREADY_LOGGED_IN,
        '해당 계정은 이미 다른 곳에서 로그인되어 있습니다.',
      );
    }

    // 비밀번호 검증
    const isValid = await validatePassword(password, databaseUser.password);
    if (!isValid) {
      throw new CustomError(ErrorCodes.INVALID_PASSWORD, '잘못된 비밀번호입니다.');
    }

    // 세션 업데이트
    const currentUser = getUserBySocket(socket);
    if (currentUser) {
      console.log(`세션 업데이트: ${currentUser.id} -> ${id}`);
      currentUser.id = id; // User 인스턴스의 id를 업데이트
      currentUser.setDatabaseId(databaseUser.id);
      user = currentUser; // user 참조 업데이트
    }

    // 마지막 로그인 시간 업데이트
    await updateUserLogin(databaseUser.id);

    const response = createResponse(
      HANDLER_IDS.LOGIN,
      0,
      {
        success: true,
        message: '로그인이 완료되었습니다.',
        failCode: 0,
        token: 'dummy-token',
      },
      databaseUser.id,
    );

    console.log('생성된 응답:', response.toString('hex', 0, response.length));
    socket.write(response);
  } catch (error) {
    console.error('로그인 처리 중 오류:', error);
    handleError(socket, { ...error, requestType: 'login' });
  }
};

export default loginHandler;

// login.handler.js
import { HANDLER_IDS } from '../../constants/handlerIds.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { handleError } from '../../utils/error/errorHandler.js';
import { findUserByUsername, validatePassword, updateUserLogin } from '../../db/user/user.db.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import { addUser } from '../../session/user.session.js';

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

    // 비밀번호 검증
    const isValid = await validatePassword(password, databaseUser.password);
    if (!isValid) {
      throw new CustomError(ErrorCodes.INVALID_PASSWORD, '잘못된 비밀번호입니다.');
    } else {
      //로그인 성공했으니 등록
      //시퀀스 문제로 연결된 클라이언트로 옮겨야함
      //addUser(id, socket);
      user.setDatabaseId(databaseUser.id);
    }

    // 마지막 로그인 시간 업데이트
    await updateUserLogin(databaseUser.id);

    const response = createResponse(
      HANDLER_IDS.LOGIN,
      0, // 성공 코드
      {
        success: true,
        message: '로그인이 완료되었습니다.',
        failCode: 0,
        token: 'dummy-token', // 실제 구현에서는 JWT 등의 토큰 사용
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

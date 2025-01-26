// errorHandler.js
import { createResponse } from '../response/createResponse.js';
import { HANDLER_IDS } from '../../constants/handlerIds.js';

export const handleError = (socket, error) => {
  console.log('=== 에러 발생 ===');
  console.log('에러 내용:', error);

  let handlerId = HANDLER_IDS.REGISTER;  // 기본값을 REGISTER로 설정

  // 요청 타입에 따라 핸들러 ID 설정
  if (error.requestType === 'login') {
    handlerId = HANDLER_IDS.LOGIN;
  }

  const errorResponse = createResponse(
    handlerId,
    error.code || 1,
    {
      success: false,
      message: error.message || '알 수 없는 오류가 발생했습니다.',
      failCode: error.code || 1
    },
    null
  );

  try {
    socket.write(errorResponse);
  } catch (writeError) {
    console.error('에러 응답 전송 실패:', writeError);
  }
};
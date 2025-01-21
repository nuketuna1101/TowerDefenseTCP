import { createResponse } from '../response/createResponse.js';

export const handleError = (socket, error) => {
  console.log("=== 에러 응답 생성 시작 ===");
  let responseCode;
  let message;
  let failCode;

  if (error.code) {
    responseCode = error.code;
    message = error.message;
    failCode = error.code;
    console.error(`에러 코드: ${error.code}, 메시지: ${error.message}`);
  } else {
    responseCode = 10000; // 일반 에러 코드
    message = error.message;
    failCode = 1; // UNKNOWN_ERROR
    console.error(`일반 에러: ${error.message}`);
  }

  const errorResponse = createResponse(
    -1, // 에러 응답용 핸들러 ID
    responseCode,
    {
      success: false,
      message: message,
      failCode: failCode
    },
    null
  );

  console.log("클라이언트로 전송할 에러 응답:", errorResponse);
  socket.write(errorResponse);
  console.log("=== 에러 응답 전송 완료 ===");
};

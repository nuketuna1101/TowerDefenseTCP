import { HANDLER_IDS } from '../../constants/handlerIds.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { handleError } from '../../utils/error/errorHandler.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import pools from '../../db/database.js';

const registerHandler = async ({ socket, userId, payload }) => {
    console.log("=== 회원가입 처리 시작 ===");
    console.log("받은 데이터:", payload);

    try {
        const { id, password, email } = payload;
        console.log("회원가입 정보:", { id, password, email });

        if (!id || !password || !email) {
            throw new CustomError(
                ErrorCodes.MISSING_FIELDS,
                '필수 필드가 누락되었습니다.'
            );
        }

        // 이메일 중복 체크
        const [existingUsers] = await pools.USER_DB.query(
            'SELECT * FROM userTable WHERE email = ?',
            [email]
        );

        if (existingUsers.length > 0) {
            throw new CustomError(
                ErrorCodes.EMAIL_ALREADY_EXISTS,
                '이미 존재하는 이메일입니다.'
            );
        }

        // 사용자 생성
        await pools.USER_DB.query(
            'INSERT INTO userTable (email, nickname, password) VALUES (?, ?, ?)',
            [email, id, password]
        );

        // 성공 응답 생성
        const response = createResponse(
            HANDLER_IDS.REGISTER,
            0,  // SUCCESS
            {
                success: true,
                message: '회원가입이 완료되었습니다.',
                failCode: 0  // NONE
            },
            null
        );

        console.log("=== 회원가입 성공 응답 전송 ===");
        socket.write(response);

    } catch (error) {
        console.error("회원가입 처리 중 오류:", error);

        // 에러 응답도 GamePacket으로 생성
        const response = createResponse(
            HANDLER_IDS.REGISTER,
            error.code || 10000,
            {
                success: false,
                message: error.message,
                failCode: error.code || 1
            },
            null
        );

        socket.write(response);
    }
};

export default registerHandler;
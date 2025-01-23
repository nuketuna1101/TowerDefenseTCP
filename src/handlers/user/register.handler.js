// register.handler.js
import { HANDLER_IDS } from '../../constants/handlerIds.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { findUserByUsername, findUserByEmail, createUser } from '../../db/user/user.db.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';

const registerHandler = async ({ socket, userId, payload }) => {
    console.log("=== 회원가입 처리 시작 ===");
    try {
        const { id, password, email } = payload;
        console.log("회원가입 정보:", { id, email });

        // 기존 사용자 확인 (username으로)
        const existingUser = await findUserByUsername(id);
        if (existingUser) {
            throw new CustomError(
                ErrorCodes.NICKNAME_ALREADY_EXISTS,
                '이미 존재하는 아이디입니다.'
            );
        }

        // 이메일 중복 확인
        const existingEmail = await findUserByEmail(email);
        if (existingEmail) {
            throw new CustomError(
                ErrorCodes.EMAIL_ALREADY_EXISTS,
                '이미 존재하는 이메일입니다.'
            );
        }

        // 사용자 생성
        await createUser({
            username: id,
            email,
            password
        });

        const response = createResponse(
            HANDLER_IDS.REGISTER,
            0,
            {
                success: true,
                message: '회원가입이 완료되었습니다.',
                failCode: 0
            },
            null
        );

        socket.write(response);

    } catch (error) {
        console.error("회원가입 처리 중 오류:", error);
        handleError(socket, { ...error, requestType: 'register' });
    }
};

export default registerHandler;
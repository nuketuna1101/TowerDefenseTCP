import { HANDLER_IDS, RESPONSE_SUCCESS_CODE } from '../../constants/handlerIds.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { handleError } from '../../utils/error/errorHandler.js';
import { findUserById, updateUserLogin } from '../../db/user/user.db.js';
import bcrypt from 'bcrypt';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';

const loginHandler = async ({ socket, userId, payload }) => {
    try {
        const { id, password } = payload;

        // 사용자 찾기
        const user = await findUserById(id);
        if (!user) {
            throw new CustomError(
                ErrorCodes.USER_NOT_FOUND,
                '사용자를 찾을 수 없습니다.'
            );
        }

        // 비밀번호 검증
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            throw new CustomError(
                ErrorCodes.INVALID_PASSWORD,
                '잘못된 비밀번호입니다.'
            );
        }

        // 마지막 로그인 시간 업데이트
        await updateUserLogin(user.id);

        const loginResponse = createResponse(
            HANDLER_IDS.LOGIN,
            RESPONSE_SUCCESS_CODE,
            {
                success: true,
                message: '로그인이 완료되었습니다.',
                userId: user.id,
            },
            null
        );

        socket.write(loginResponse);
    } catch (error) {
        handleError(socket, error);
    }
};

export default loginHandler;
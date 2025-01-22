// register.handler.js
import { HANDLER_IDS } from '../../constants/handlerIds.js';
import { createResponse } from '../../utils/response/createResponse.js';
import pools from '../../db/database.js';

const registerHandler = async ({ socket, userId, payload }) => {
    console.log("=== 회원가입 처리 시작 ===");
    try {
        const { id, password, email } = payload;
        console.log("회원가입 정보:", { id, password, email });

        // 기존 사용자 확인 (username으로)
        const [existingUsersByUsername] = await pools.USER_DB.query(
            'SELECT * FROM userTable WHERE username = ?',
            [id]  // id를 username 필드에 저장
        );

        if (existingUsersByUsername.length > 0) {
            const response = createResponse(
                HANDLER_IDS.REGISTER,
                1,
                {
                    success: false,
                    message: '이미 존재하는 아이디입니다.',
                    failCode: 1
                },
                null
            );
            socket.write(response);
            return;
        }

        // 이메일 중복 확인
        const [existingUsersByEmail] = await pools.USER_DB.query(
            'SELECT * FROM userTable WHERE email = ?',
            [email]
        );

        if (existingUsersByEmail.length > 0) {
            const response = createResponse(
                HANDLER_IDS.REGISTER,
                1,
                {
                    success: false,
                    message: '이미 존재하는 이메일입니다.',
                    failCode: 1
                },
                null
            );
            socket.write(response);
            return;
        }

        // 사용자 생성
        const [insertResult] = await pools.USER_DB.query(
            'INSERT INTO userTable (username, email, password) VALUES (?, ?, ?)',
            [id, email, password]  // id를 username 필드에 저장
        );

        // userScore 테이블에도 레코드 생성
        await pools.USER_DB.query(
            'INSERT INTO userScore (userId, highScore) VALUES (?, ?)',
            [insertResult.insertId, 0]
        );

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
        const response = createResponse(
            HANDLER_IDS.REGISTER,
            1,
            {
                success: false,
                message: '회원가입 처리 중 오류가 발생했습니다.',
                failCode: 1
            },
            null
        );
        socket.write(response);
    }
};

export default registerHandler;
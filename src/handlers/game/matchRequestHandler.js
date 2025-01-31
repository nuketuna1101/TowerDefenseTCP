import { handleError } from '../../utils/error/errorHandler.js';
import MatchMake from '../../classes/models/matchMake.class.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';

export const matchMaker = new MatchMake();

// monsterData, TowerData도 매개변수로 같이 받아오기기
const matchRequestHandler = ({ socket, userId, payload, user }) => {
    try {
        if (!user) {
            throw new Error(ErrorCodes.USER_NOT_FOUND, '유저를 찾을 수 없습니다.');
        }

        // 매칭 대기열에 사용자 추가
        matchMaker.enqueueUser(user);
    } catch (e) {
        handleError(socket, e);
    }
};

export default matchRequestHandler;
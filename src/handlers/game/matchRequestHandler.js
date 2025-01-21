import MatchMake from "../../classes/models/matchMake.class.js";
import { getUserById } from "../../session/user.session.js";
import { ErrorCodes } from "../../utils/error/errorCodes.js";
import { handleError } from "../../utils/error/errorHandler.js";

const matchMaker = new MatchMake();

const matchRequestHandler = ({socket, userId}) => {
    try{
        // 세션에서 사용자 정보를 가져오기
        const user = getUserById(userId);
        if(!user) {
            throw new Error(ErrorCodes.USER_NOT_FOUND, "유저를 찾을 수 없습니다.");
        }

        // 매칭 대기열에 사용자 추가
        matchMaker.enqueueUser(user);
        // 아래 방식의 프로토 버퍼를 만들어서 패킷을 제작을 해야 한다
        // 어떤식으로 패킷을 만드는 코드를 추가할것인가????????
        // 프로토버퍼? game.notification.js?
        // S2CMatchStartNotification { InitialGameState initialGameState = 1; GameState playerData = 2; GameState opponentData = 3;}
        socket.write('매칭 대기열이 추가되었습니다.');
    } catch(e) {
        handleError(socket, e);
    }
};

export default matchRequestHandler;
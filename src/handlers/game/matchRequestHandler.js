import MatchMake from '../../classes/models/matchMake.class.js';
import { getProtoMessages } from '../../init/loadProtos.js';
import { getUserById } from '../../session/user.session.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import { handleError } from '../../utils/error/errorHandler.js';
import { craeteS2CMatchStartNotificationPacket } from '../../utils/notification/game.notification.js';

const matchMaker = new MatchMake();

// monsterData, TowerData도 매개변수로 같이 받아오기기
const matchRequestHandler = ({ socket, userId, payload }) => {
  try {
    // 매칭 완료 패킷에 담아줄 GameState / InitialGameState를 핸들러에서 만든 후 패킷 만드는 함수에 매개변수 전송
    const protoMessages = getProtoMessages();
    const GameState = protoMessages.test.GameState;
    const InitialGameState = protoMessages.test.InitialGameState;

    /*
        const payload = { timestamp };
        const message = ping.create(payload);
        const pingPacket = ping.encode(message).finish();
    */

    // 세션에서 사용자 정보를 가져오기
    const user = getUserById(userId);
    if (!user) {
      throw new Error(ErrorCodes.USER_NOT_FOUND, '유저를 찾을 수 없습니다.');
    }

    /*
    message InitialGameState {
        int32 baseHp = 1;
        int32 towerCost = 2;
        int32 initialGold = 3;
        int32 monsterSpawnInterval = 4;
    }

    message GameState {
        int32 gold = 1;
        BaseData base = 2;
        int32 highScore = 3;
        repeated TowerData towers = 4;
        repeated MonsterData monsters = 5;
        int32 monsterLevel = 6;
        int32 score = 7;
        repeated Position monsterPath = 8;
        Position basePosition = 9;
    }
    */

    // 매칭 대기열에 사용자 추가
    matchMaker.enqueueUser(user);
    // S2CMatchStartNotification { InitialGameState initialGameState = 1; GameState playerData = 2; GameState opponentData = 3;}
    const matchPacket = craeteS2CMatchStartNotificationPacket();
    socket.write(matchPacket, '매칭 대기열이 추가되었습니다.');
  } catch (e) {
    handleError(socket, e);
  }
};

export default matchRequestHandler;

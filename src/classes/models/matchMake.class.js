import { MAX_PLAYERS } from './game.class.js';
import matchResponseHandler from '../../handlers/game/matchResponse.handler.js';

class MatchMake {
  constructor() {
    // 매치 대기열
    this.queue = [];
  }

  // 대기열에 사용자 추가
  enqueueUser(user) {
    this.queue.push(user);
    console.log(`${user.id}님이 대기열에 등록되었습니다.`);

    // 매치 조건 충족 시 매칭 실행
    if (this.queue.length >= MAX_PLAYERS) {
      this.startMatch();
    }
  }

  // 매치 대기열에서 사용자 추출 및 게임 시작
  startMatch() {
    // 대기열에서 사용자 추출
    const usersForGame = this.queue.splice(0, MAX_PLAYERS);
    const [user1, user2] = usersForGame;

    // 대기열에서 추출된 사용자들에게 createGameHandler 호출

    console.log(`user1의 소켓 => ${user1.socket} / user2의 소켓 => ${user2.socket}`);

    matchResponseHandler({
      socket: user1.socket,
      userId: user1.id,
      payload: {},
      additionalUsers: [user2.id],
    });

    console.log(`매치 생성 완료 (참가 플레이어) : ${usersForGame.map((u) => u.id).join(', ')}`);
  }
}

export default MatchMake;

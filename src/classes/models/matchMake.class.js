import { MAX_PLAYERS } from './game.class.js';
import matchResponseHandler from '../../handlers/game/matchResponse.handler.js';
import { v4 as uuidv4 } from 'uuid';
import { addGameSession } from '../../session/game.session.js';
import { removeUserSessions } from '../../session/sessions.js';

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
    let usersForGame = this.queue.splice(0, MAX_PLAYERS);
    const [user1, user2] = usersForGame;

    // 나간 사용자를 필터링
    const activeUsers = usersForGame.filter(
      (user) => !removeUserSessions.some((removedUser) => removedUser.socket === user.socket),
    );

    // 나간 사용자 로그 출력
    if (activeUsers.length < MAX_PLAYERS) {
      console.log(
        '게임 시작 전 사용자가 나갔습니다. 매칭을 취소하고 대기열에 남은 사용자를 다시 추가합니다.',
      );

      // 나가지 않은 사용자들을 다시 대기열에 추가
      this.queue.push(...activeUsers);
      return;
    }

    // 새로운 게임 ID 생성
    const gameId = uuidv4();
    // 게임 세션 생성
    const gameSession = addGameSession(gameId);

    matchResponseHandler({
      socket: user1.socket,
      userId: user1.id,
      payload: {},
      gameSession: gameSession,
    });

    matchResponseHandler({
      socket: user2.socket,
      userId: user2.id,
      payload: {},
      gameSession: gameSession,
    });

    console.log(`매치 생성 완료 (참가 플레이어) : ${activeUsers.map((u) => u.id).join(', ')}`);
  }
}

export default MatchMake;

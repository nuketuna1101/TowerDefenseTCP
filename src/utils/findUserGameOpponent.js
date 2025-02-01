import { getUserBySocket } from '../session/user.session.js';
import { getGameByUser } from '../session/game.session.js';
import { testLog } from './testLogger.js';

export const findUserGameOpponentBySocket = (socket) => {
  const user = getUserBySocket(socket);

  let game;
  let opponent;
  if (!user) {
    throw new Error('유저를 찾을 수 없습니다.');
  }
  testLog(0, `userid ${user.id}`);
  if (user !== undefined) { //게임이 종료된 후에(game이 없어진 상태) 남아있는 몬스터스폰req가 이 함수를 실행해 없는 game을 찾는걸 막기 / 못찿는 오류가 나도 서버나 진행에 문제는 없으나 그냥 거슬렸음
    game = getGameByUser(user);

    if (!game) {
      throw new Error('게임을 찾을 수 없습니다.');
    }

    opponent = game.users.find((u) => u.id !== user.id);

    if (!opponent) {
      throw new Error('상대방을 찾을 수 없습니다.');
    }
  }
  return { user, game, opponent };
};

export default findUserGameOpponentBySocket;
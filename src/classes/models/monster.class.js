import { getUserById } from '../../session/user.session.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import { testLog } from '../../utils/testLogger.js';


class Monster {
  constructor(id, monsterNum, monsterLevel) {
    this.id = id;
    this.num = monsterNum;
    this.level= monsterLevel;
  }


  monsterDead(userId) {

    //S2CEnemyMonsterDeathNotification or C2SMonsterDeathNotification
    const packet = {
      monsterId: this.id,
    };

    this.removeMonster(userId, this.id);

    return packet;
  }

  removeMonster(userId, monsterId) {
    const user = getUserById(userId);
    testLog(0,`몬스터 삭제 로그 ${monsterId} ${user.monsters.length}`,'red');
    if (!user) {
      throw new CustomError(ErrorCodes.USER_NOT_FOUND, '유저를 찾을 수 없습니다.');
    }

    user.monsters = user.monsters.filter((monster) => monster.id !== monsterId);
  }
}

export function spawnMonster(id, monsterNum, user) {
  const monster = new Monster(id,monsterNum,user.monsterLevel);

  testLog(0, `[Monster Class] monster: ${JSON.stringify(monster)}`);

  if (!user)
    throw new CustomError(ErrorCodes.CANNOT_FIND, "못차장~");

  user.addMonster(monster);

  return monster;
}

export default Monster;

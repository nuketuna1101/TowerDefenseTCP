import { getUserById } from '../../session/user.session.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import { testLog } from '../../utils/testLogger.js';

let monsterNum = 0;

class Monster {
  constructor(id, monsterNum, monsterLevel) {
    this.id = id;
    this.num = monsterNum;
    this.level= monsterLevel;
  }
  // packet을 return만 하고 호출부에서 game.Notification안의 함수들로 패킷과 패킷타입을 감싸 버퍼객체로 보낸다


  getMonster(monsterId) {
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
  // user클래스의 monster 배열에 몬스터 추가
  // if (user) {
  //   /*
  //   // Legacy
  //   user.addMonster({
  //     monsterId: monster.id,
  //     monsterNumber: monsterNum,
  //     level: user.monsterLevel,
  //   });
  //   */
  //   user.addMonster(monster);
  // }

  //만든 몬스터는 어디로??
  //S2CSpawnMonsterResponse or S2CSpawnEnemyMonsterNotification
  // const packet = {
  //   monsterId: monster.id,//일단 대충만든 몬스터번호 회의하며 정하기
  //   monsterNumber: monsterNum, 
  // };
  // return packet;
  return monster;
}

export default Monster;

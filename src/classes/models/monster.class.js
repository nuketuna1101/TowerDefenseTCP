import { getUserById } from '../session/user.session.js';
import CustomError from '../utils/error/customError.js';

let monsterNum = 0;

class Monster {
  constructor(id,monsterNum,monsterLevel) {
    this.id = id;
    this.num = monsterNum;
    this.level= user.monsterLevel;
  }
// packet을 return만 하고 호출부에서 game.Notification안의 함수들로 패킷과 패킷타입을 감싸 버퍼객체로 보낸다


  getMonster(monsterId) {
  }

  //이 메서드 자체가 쓸모 없을지도
  attackBase(userId, damage) {
    //base의 체력을 깎는 함수
    const baseHp = changeBaseHp(damage);



    // // S2CUpdateBaseHPNotification changeBase에서 packet을 생성하면 딱히 필요 없을듯
    // const packet = {
    //   isOpponent: isOpponent,
    //   baseHp: baseHp,
    // };

    this.removeMonster(userId, this.num);

    return [userId,baseHp];
  }

  monsterDead(userId) {
    this.alive = false;

    //S2CEnemyMonsterDeathNotification or C2SMonsterDeathNotification
    const packet = {
      monsterId: this.id,
    };

    this.removeMonster(userId, this.id);

    return packet;
  }

  removeMonster(userId, monsterId) {
    const user = getUserById(userId);
    if (!user) {
      throw new CustomError(ErrorCodes.USER_NOT_FOUND, '유저를 찾을 수 없습니다.');
    }

    user.monsters = user.monsters.filter((monster) => monster.id !== monsterId);
  }
}

export function spawnMonster(id, monsterNum, user) {
  const monster = new Monster(id,monsterNum );

  // user클래스의 monster 배열에 몬스터 추가
  if (user) {
    user.addMonster({
      monsterId: monster.id,
      monsterNumber: monsterNum,
      level: user.monsterLevel,
    });
  }

  //만든 몬스터는 어디로??
  //S2CSpawnMonsterResponse or S2CSpawnEnemyMonsterNotification
  const packet = {
    monsterId: monster.id,//일단 대충만든 몬스터번호 회의하며 정하기
    monsterNumber: monsterNum, 
  };
  return packet;
}

export default Monster;

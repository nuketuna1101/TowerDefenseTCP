let monsterNum=0;

class Monster {
  constructor(id, hp,hpPerLv,def,defPerLv,atk,atkPerLv) {
    this.id = id;
    this.maxHp = hp;
    this.hp = hp;
    this.hpPerLv = hpPerLv;
    this.def = def;
    this.defPerLv = defPerLv;
    this.atk = atk;
    this.atkPerLv = atkPerLv;
    this.alive = true;
  }


// packet을 return만 하고 호출부에서 game.Notification안의 함수들로 패킷과 패킷타입을 감싸 버퍼객체로 보낸다


  getMonster(id) {
    //이게 필요한가?
  }

  attackBase(userId,damage) {
    //base의 체력을 깎는 함수
    const baseHp = changeBaseHp(damage);

    const user = getUserById(userId);
    if (!user) {
      throw new CustomError(ErrorCodes.USER_NOT_FOUND, '유저를 찾을 수 없습니다.');
    }

    isOpponent = user.id !== userId;

    // S2CUpdateBaseHPNotification changeBase에서 packet을 생성하면 딱히 필요 없을듯
    const packet = {
      isOpponent: isOpponent,
      baseHp: baseHp
    };

    this.removeMonster();

    return packet;
  }

  monsterDead(id) {
    this.alive = false;
    removeMonster(id);

    //S2CEnemyMonsterDeathNotification or C2SMonsterDeathNotification
    const packet = {
      monsterId: this.id,
    };
    return packet;
  }

  removeMonster(userId,monsterId){
    const user = getUserById(userId);
    if (!user) {
      throw new CustomError(ErrorCodes.USER_NOT_FOUND, '유저를 찾을 수 없습니다.');
    }

    user.monsters = user.monsters.filter(monster => monster.id !== monsterId);
  }
}

export function spawnMonster(id, hp, hpPerLv, def, defPerLv, atk, atkPerLv) {
  const monster = new Monster(id, hp, hpPerLv, def, defPerLv, atk, atkPerLv);

  // 배열에는 이렇게 넣기
  // messege MonsterData{
  //   int32 monsterId = 1;
  //   int32 monsterNumber = 2;
  //   int32 level = 3;
  // }


  //만든 몬스터는 어디로??
  //S2CSpawnMonsterResponse or S2CSpawnEnemyMonsterNotification 
  const packet = {
    monsterId: monster.id,
    monsterNumber: monsterNum, //일단 대충만든 몬스터번호 회의하며 정하기
  };

  monsterNum++;
  return packet;
}

export default Monster;

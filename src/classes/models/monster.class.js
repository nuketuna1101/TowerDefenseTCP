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

  spawnMonster(id, hp, hpPerLv, def, defPerLv, atk, atkPerLv) {
    const monster = new Monster(id, hp, hpPerLv, def, defPerLv, atk, atkPerLv);

    //만든 몬스터는 어디로??
    //S2CSpawnMonsterResponse or S2CSpawnEnemyMonsterNotification 
    const packet = {
      monsterId: monster.id,
      monsterNumber: monsterNum,
    };
    monsterNum++;
    return packet;
  }

  getMonster(id) {
    //이게 필요한가?
  }

  attackBase(userId) {
    //base의 체력을 깎는 함수
    const baseHp = changeBaseHp(this.atk);

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

    //뭘 써야하는가 그것이 문제다
    this.monsterDead();
    this.removeMonster();

    return packet;
  }

  monsterDead(id) {
    this.alive = false;
    removeMonster(id);

    //S2CEnemyMonsterDeathNotification
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

export default Monster;

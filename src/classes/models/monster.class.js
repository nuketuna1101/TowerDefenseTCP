class Monster {
  constructor(id, hp,hpPerLv,def,defPerLv,atk,atkPerLv,path) {
    this.id = id;
    this.maxHp = hp;
    this.hp = hp;
    this.hpPerLv = hpPerLv;
    this.def = def;
    this.defPerLv = defPerLv;
    this.atk = atk;
    this.atkPerLv = atkPerLv;
    this.path = path;
    this.alive = true;
  }

  spawnMonster(id, hp,hpPerLv,def,defPerLv,atk,atkPerLv,path) {
    const monster = new Monster(id, hp,hpPerLv,def,defPerLv,atk,atkPerLv,path);
    return monster; //객체만 반환하고 패킷생성 및 전송은 어딘가의 핸들러나 루프안에서 해야할듯?
  }

  getMonster(id) {
    //이게 필요한가?
  }

  attackBase() {
    this.monsterDead();
    //base의 체력을 깎는 함수
  }

  monsterDead() {
    this.alive = false;
  }
}

export default Monster;

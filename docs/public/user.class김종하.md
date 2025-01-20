
유저에 타워/몬스터 관련

  addMonster(monster) {
    this.monster.push(monster);
  }

  addTower(tower) {
    this.tower.push(tower);
  }

  //웨이브마다 초기화?
  removeMonster(){
    this.monster = [];
  }

  //특정 타워를 삭제할 경우가 있을것. 아마도?
  removeTower(){
    //placeholder
    this.tower = [];
  }
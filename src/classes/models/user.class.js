//user.class.js
//import { createPingPacket } from '../../utils/notification/game.notification.js';
import { userInit } from '../../constants/userConstants.js';
import { getHandlerById } from '../../handlers/index.js';
class User {
  constructor(id, socket) {
    this.id = id;
    this.socket = socket;
    this.sequence = 1;
    this.gold = userInit.gold;
    this.baseHp = userInit.baseHp;
    this.monsterLevel = userInit.monsterLevel;
    this.score = userInit.score;
    this.monster = [];
    this.tower = [];
    this.lastUpdateTime = Date.now();
  }

  getNextSequence() {
    return ++this.sequence;
  }

  getMonsterLevel() {
    return ++this.monsterLevel;
  }

  nextMonsterLevel() {
    return ++this.monsterLevel;
  }

  ping() {
    const now = Date.now();

    // console.log(`${this.id}: ping`);
    //this.socket.write(createPingPacket(now));
  }

  handlePong(data) {
    const now = Date.now();
    this.latency = (now - data.timestamp) / 2;
    // console.log(`Received pong from user ${this.id} at ${now} with latency ${this.latency}ms`);
  }

  
  addMonster(monster) {
    this.monster.push(monster);
  }

  addTower(tower) {
    this.tower.push(tower);
  }

  //웨이브마다 초기화?
  removeMonster() {
    this.monster = [];
  }

  //특정 타워를 삭제할 경우가 있을것. 아마도?
  removeTower() {
    //placeholder
    this.tower = [];
  }

  addGold(gold) {
    this.gold += gold;
    //싱크?
    
    const handler = getHandlerById(7);
    handler({
      socket: this.socket,
      userId: user.id,
      payload:{},
      user: this,
    });

    return this.gold;
  }

  substractGold(gold) {
    if (this.gold < gold) {
      return -1;
    }
    this.gold -= gold;
    //싱크?

    const handler = getHandlerById(7);
    handler({
      socket: this.socket,
      userId: this.id,
      payload:{},
      user: this,
    });

    return this.gold;
  }

  setBaseHp(baseHp) {
    this.baseHp = baseHp;

    return this.gold;
  }

  substractBaseHp(baseHp) {
    if (this.baseHp < baseHp) {
      return -1;
    }
    this.baseHp -= baseHp;
    
    return this.baseHp;
  }


  // 추측항법을 사용하여 위치를 추정하는 메서드
  // calculatePosition(latency) {
  //   const timeDiff = latency / 1000; // 레이턴시를 초 단위로 계산
  //   const speed = 1; // 속도 고정
  //   const distance = speed * timeDiff;

  //   // x, y 축에서 이동한 거리 계산
  //   return {
  //     x: this.x + distance,
  //     y: this.y,
  //   };
  // }
}

export default User;

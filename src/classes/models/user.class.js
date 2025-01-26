//user.class.js
// import { createPingPacket } from '../../utils/notification/game.notification.js';
import { userInit } from '../../constants/userConstants.js';
import { getHandlerById } from '../../handlers/index.js';
import { testLog } from '../../utils/testLogger.js';
class User {
  constructor(id, socket) {
    this.id = id;
    this.databaseId = null;
    this.socket = socket;
    this.sequence = 0;
    this.gold = userInit.gold;
    this.baseHp = userInit.baseMaxHp;
    this.baseMaxHp = userInit.baseMaxHp;
    this.monsterLevel = userInit.monsterLevel;
    this.score = userInit.score;
    this.monster = [];
    this.tower = [];
    this.path = [];
    this.lastUpdateTime = Date.now();
  }

  userInitialize() {
    this.gold = userInit.gold;
    this.baseHp = userInit.baseMaxHp;
    this.baseMaxHp = userInit.baseMaxHp;
    this.monsterLevel = userInit.monsterLevel;
    this.score = userInit.score;
    this.monster = [];
    this.tower = [];
    this.lastUpdateTime = Date.now();
  }

  getNextSequence() {
    this.lastUpdateTime = Date.now();
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
    // this.socket.write(createPingPacket(now));
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

  //몬스터 초기화
  removeMonster() {
    this.monster = [];
  }

  //특정 타워를 삭제할 경우가 있을것. 아마도?
  removeTowerById(towerId) {
    //placeholder
    const deletingTower = this.tower.findIndex((value) => {
      return Object.values(value)[0] == towerId;
    });
    if (deletingTower < 0) return deletingTower;
    this.tower.splice(deletingTower, 1);
    return deletingTower;
  }
  //타워 초기화
  removeTower() {
    this.tower = [];
  }

  addGold(gold) {
    this.gold += gold;

    usersync(this);
    return this.gold;
  }

  substractGold(gold) {
    if (this.gold < gold) {
      return -1;
    }
    this.gold -= gold;
    usersync(this);
    return this.gold;
  }

  setBaseHp(baseHp) {
    this.baseHp = baseHp;
    updateBaseHp(this);

    return this.baseHp;
  }

  addBaseHp(baseHp) {
    this.baseHp = this.baseHp + baseHp > this.baseMaxHp ? this.baseMaxHp : this.baseHp + baseHp;
    updateBaseHp(this);

    return this.baseHp;
  }

  substractBaseHp(baseHp) {
    if (this.baseHp < baseHp) {
      const handler = getHandlerById(18);
      handler({
        user: this,
      });

      return -1;
    }
    this.baseHp -= baseHp;
    updateBaseHp(this);

    return this.baseHp;
  }

  setDatabaseId(databaseId) {
    return (this.databaseId = databaseId);
  }

  addScore(points) {
    this.score += points;
    this.usersync(this);
  }

  getScore() {
    return this.score;
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

//싱크
const usersync = (user) => {
  const handler = getHandlerById(7);
  handler({
    socket: user.socket,
    userId: user.id,
    payload: {},
    user: user,
  });
};

const updateBaseHp = (user) => {
  const handler = getHandlerById(17);
  handler({
    user: user,
  });
};
export default User;

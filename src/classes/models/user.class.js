import { createPingPacket } from '../../utils/notification/game.notification.js';

class User {
  constructor(id, socket) {
    this.id = id;
    this.socket = socket;
    this.monster = [];
    this.tower = [];
    this.sequence = 0;
    this.lastUpdateTime = Date.now();
  }

  addMonster(monster) {
    this.monster.push(monster);
  }

  addTower(tower) {
    this.tower.push(tower);
  }

  getNextSequence() {
    return ++this.sequence;
  }

  ping() {
    const now = Date.now();

    // console.log(`${this.id}: ping`);
    this.socket.write(createPingPacket(now));
  }

  handlePong(data) {
    const now = Date.now();
    this.latency = (now - data.timestamp) / 2;
    // console.log(`Received pong from user ${this.id} at ${now} with latency ${this.latency}ms`);
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

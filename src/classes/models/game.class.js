//game.class.js
import IntervalManager from '../managers/interval.manager.js';
import {
  createLocationPacket,
  gameStartNotification,
} from '../../utils/notification/game.notification.js';

export const MAX_PLAYERS = 2;

class Game {
  constructor(id) {
    this.id = id;
    this.users = [];
    this.intervalManager = new IntervalManager();
    this.state = 'waiting'; // 'waiting', 'inProgress'
  }

  // 내가 사용할 패킷
  // C2SMatchRequest {}
  // S2CMatchStartNotification { InitialGameState initialGameState = 1; GameState playerData = 2; GameState opponentData = 3;}

  // addUser를 할때 MatchMake를 사용해야 할듯?
  addUser(user) {
    if (this.users.length >= MAX_PLAYERS) {
      throw new Error('Game session is full');
    }
    
    this.users.push(user);
    this.intervalManager.addPlayer(user.id, user.ping.bind(user), 1000);
  }

  getUser(userId) {
    return this.users.find((user) => user.id === userId);
  }

  removeUser(userId) {
    this.users = this.users.filter((user) => user.id !== userId);
    this.intervalManager.removePlayer(userId);

    if (this.users.length < MAX_PLAYERS) {
      this.state = 'waiting';
    }
  }

  getMaxLatency() {
    let maxLatency = 0;
    this.users.forEach((user) => {
      console.log(`${user.id}: ${user.latency}`);
      maxLatency = Math.max(maxLatency, user.latency);
    });
    return maxLatency;
  }

  startGame() {
    this.state = 'inProgress';
    const startPacket = gameStartNotification(this.id, Date.now());
    console.log(`max latency: ${this.getMaxLatency()}`);

    this.users.forEach((user) => {
      user.socket.write(startPacket);
    });
  }

  // getAllLocation() {
  //   const maxLatency = this.getMaxLatency();

  //   const locationData = this.users.map((user) => {
  //     const { x, y } = user.calculatePosition(maxLatency);
  //     return { id: user.id, x, y };
  //   });
  //   return createLocationPacket(locationData);
  // }


  //#region NOTIFY 위해 Game 내 users 가져오기
  getUsers(){
    return this.users;
  }
  //#endregion
}

export default Game;

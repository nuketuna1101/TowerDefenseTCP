import { spawnMonster } from '../../classes/models/monster.class.js';
import { createS2CSpawnMonsterResponse,createS2CSpawnEnemyMonsterNotification } from '../../utils/notification/monster.notification.js';
import {findUserGameOpponentBySocket} from '../../utils/findUserGameOpponent.js';
import {addMonster,removemonster,getMonsterById} from '../../session/monster.session.js'
import { testLog } from '../../utils/testLogger.js';

//테스트용 id,num
let monsterid = 1; 
const monsterNum = 1;

export const spawnMonsterReqHandler = ({socket}) => {

  const {user,opponent}=findUserGameOpponentBySocket(socket);
  testLog(0,`spawnMonsterReqHandler에 user가 있을까? ${user}`,'blue');
  testLog(0,`spawnMonsterReqHandler에 user.socket이 있을까? ${user.socket}`,'red');
  const monster = spawnMonster(monsterid,monsterNum,user);
  addMonster(monster);

  const response = createS2CSpawnMonsterResponse(monster.monsterId,monster.monsterNumber,user);
  const notification = createS2CSpawnEnemyMonsterNotification(monster.monsterId,monster.monsterNumber);

  testLog(0,`response: ${response.toString('hex')}, notification: ${notification}`,'red');
  user.socket.write(response);
  opponent.socket.write(notification);
};


export const monsterDeathNotificationHandler = ({socket, payload}) => {

  const {user,opponent}=findUserGameOpponentBySocket(socket);
  const{monsterId} = payload;
  const monster = user.monsters.find((monster) => monster.id === monsterId);
  if (!monster) {
    throw new Error(`몬스터를 찾을 수 없습니다. ID: ${monsterId}`);
  }
  removemonster(monsterId);
  const packet = monster.monsterDead(user.id);
  const notification = createResponse(21, 'S2CEnemyMonsterDeathNotification', packet);

  opponent.socket.write(notification);
};

// export const monsterAttackBaseReqHandler = (socket, damage) => {
//   const {user,game,opponent}=findUserGameOpponentByUser(socket);


//   changeBaseHp(damage);

  
// };

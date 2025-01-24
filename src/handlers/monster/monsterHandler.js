import { spawnMonster } from '../../classes/models/monster.class.js';
import { createResponse } from '../../utils/response/createResponse.js';
import {findUserGameOpponentByUser} from '../../utils/findUserGameOpponent.js'

export const spawnMonsterReqHandler = (socket, monsterData) => {
  const { id,monsterNum} = monsterData;

  const {user,opponent}=findUserGameOpponentByUser(socket);

  const monster = spawnMonster(id,monsterNum,user);

  const response = createResponse(12, 'S2CSpawnMonsterResponse', monster);
  const notification = createResponse(13, 'S2CSpawnEnemyMonsterNotification', monster);

  user.socket.write(response);
  opponent.socket.write(notification);
};

export const monsterDeathNotificationHandler = (socket, monsterId) => {

  const {user,opponent}=findUserGameOpponentByUser(socket);

  const monster = user.monsters.find((monster) => monster.id === monsterId);
  if (!monster) {
    throw new Error(`몬스터를 찾을 수 없습니다. ID: ${monsterId}`);
  }

  const packet = monster.monsterDead(user.id);
  const notification = createResponse(21, 'S2CEnemyMonsterDeathNotification', packet);

  opponent.socket.write(notification);
};


// export const monsterAttackBaseReqHandler = (socket, damage) => {
//   const {user,game,opponent}=findUserGameOpponentByUser(socket);


//   changeBaseHp(damage);

  
// };


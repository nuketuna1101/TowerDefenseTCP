import { spawnMonster } from '../../classes/models/monster.class.js';
import { getUserById } from '../../session/user.session.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { HANDLER_IDS } from '../../constants/handlerIds.js';

const spawnMonsterReqHandler = (userId, monsterData) => {
  const { id, hp, hpPerLv, def, defPerLv, atk, atkPerLv } = monsterData;
  const monster = spawnMonster(id, hp, hpPerLv, def, defPerLv, atk, atkPerLv);

  const user = getUserById(userId);
  if (!user) {
    throw new Error('유저를 찾을 수 없습니다.');
  }

  //몬스터를 스폰한게 본인인지 상대방인ㅇ지 어떻게 구분하는가?
  let packetName;
  if (user.id === userId) {
    packetName = 'S2CSpawnMonsterResponse';
  }
  if (user.id !== userId) {
    packetName = 'S2CSpawnEnemyMonsterNotification';
  }

  const response = createResponse(HANDLER_IDS.SPAWN_MONSTER, 0, monster, userId);
  user.socket.write(response);
};

export default spawnMonsterReqHandler;

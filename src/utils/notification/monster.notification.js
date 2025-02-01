import { getProtoMessages } from '../../init/loadProtos.js';
import { PACKET_TYPE } from '../../constants/header.js';
import { payloadParser } from '../parser/packetParser.js';
import { testLog } from '../testLogger.js';

export const createS2CSpawnMonsterResponse = (monsterId, monsterNumber, user) => {
  const protoMessages = getProtoMessages();
  const dataType = protoMessages.test.GamePacket;

  if (!dataType) {
    throw new Error('dataType 메세지 정의 x');
  }

  testLog(0, `dataType: ${dataType}`, 'green');

  const payload = {
    spawnMonsterResponse: {
      monsterId,
      monsterNumber,
    },
  };

  testLog(0, `payload:${JSON.stringify(payload)} `, 'yellow');

  const message = dataType.create(payload);
  const monsterSpawnPacket = dataType.encode(message).finish();
  testLog(0, `message: ${JSON.stringify(message)}`, 'red');
  testLog(0, `monsterSpawnPacket: ${monsterSpawnPacket.toString('hex')}`, 'blue');

  return payloadParser(PACKET_TYPE.SPAWN_MONSTER_RESPONSE, user, monsterSpawnPacket);
};

export const createS2CSpawnEnemyMonsterNotification = (monsterId, monsterNumber, user) => {
  const protoMessages = getProtoMessages();
  const dataType = protoMessages.test.GamePacket;

  if (!dataType) {
    throw new Error('dataType 메세지 정의 x');
  }

  const payload = {
    spawnEnemyMonsterNotification: {
      monsterId,
      monsterNumber,
    },
  };

  const message = dataType.create(payload);
  const monsterSpawnPacket = dataType.encode(message).finish();

  return payloadParser(PACKET_TYPE.SPAWN_ENEMY_MONSTER_NOTIFICATION, user, monsterSpawnPacket);
};

export const createS2CEnemyMonsterDeathNotification = (monsterId, user) => {
  const protoMessages = getProtoMessages();
  const dataType = protoMessages.test.GamePacket;

  if (!dataType) {
    throw new Error('dataType 메세지 정의 x');
  }

  const payload = {
    enemyMonsterDeathNotification: {
      monsterId,
    },
  };

  const message = dataType.create(payload);
  const monsterDeathPacket = dataType.encode(message).finish();
  return payloadParser(PACKET_TYPE.ENEMY_MONSTER_DEATH_NOTIFICATION, user, monsterDeathPacket);
};

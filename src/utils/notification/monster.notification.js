//game.notification.js
import { getProtoMessages } from '../../init/loadProtos.js';
import { PACKET_TYPE } from '../../constants/header.js';
import { config } from '../../config/config.js';
import { payloadParser } from '../parser/packetParser.js';
import { testLog } from '../testLogger.js';

export const makeNotification = (message, type) => {
  // 패킷 길이 정보를 포함한 버퍼 생성
  const packetLength = Buffer.alloc(config.packet.totalLength);
  packetLength.writeUInt32BE(
    message.length + config.packet.totalLength + config.packet.packetTypeLength,
    0,
  );

  // 패킷 타입 정보를 포함한 버퍼 생성
  const packetType = Buffer.alloc(config.packet.packetTypeLength);
  packetType.writeUInt8(type, 0);

  // 길이 정보와 메시지를 함께 전송
  return Buffer.concat([packetLength, packetType, message]);
};

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

  // return makeNotification(monsterSpawnPacket,PACKET_TYPE.SPAWN_MONSTER_RESPONSE);
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

  // return makeNotification(monsterSpawnPacket,PACKET_TYPE.SPAWN_MONSTER_RESPONSE);
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

  // return makeNotification(monsterSpawnPacket,PACKET_TYPE.SPAWN_MONSTER_RESPONSE);
  return payloadParser(PACKET_TYPE.ENEMY_MONSTER_DEATH_NOTIFICATION, user, monsterDeathPacket);
};

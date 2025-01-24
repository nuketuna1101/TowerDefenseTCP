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

export const createS2CSpawnMonsterResponse = (monsterId,monsterNum) => {
  const protoMessages = getProtoMessages();
  const dataType = protoMessages.test.S2CSpawnMonsterResponse;

  const payload = {monsterId,monsterNum};
  const message = dataType.create(payload);
  const userStateDataPacket = dataType.encode(message).finish();
  return makeNotification(userStateDataPacket,PACKET_TYPE.SPAWN_MONSTER_RESPONSE);
};

export const createS2CSpawnEnemyMonsterNotification = (monsterId,monsterNum) => {
  const protoMessages = getProtoMessages();
  const dataType = protoMessages.test.S2CSpawnEnemyMonsterNotification;

  const payload = {monsterId,monsterNum};
  const message = dataType.create(payload);
  const userStateDataPacket = dataType.encode(message).finish();
  return makeNotification(userStateDataPacket,PACKET_TYPE.SPAWN_ENEMY_MONSTER_NOTIFICATION);
};




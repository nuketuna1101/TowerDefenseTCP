//game.notification.js
import { getProtoMessages } from '../../init/loadProtos.js';
import { PACKET_TYPE } from '../../constants/header.js';
import { config } from '../../config/config.js';
import { payloadParser } from '../parser/packetParser.js';

const makeNotification = (message, type) => {
  // 패킷 길이 정보를 포함한 버퍼 생성
  const packetLength = Buffer.alloc(config.packet.totalLength);
  packetLength.writeUInt32BE(
    message.length + config.packet.totalLength + config.packet.typeLength,
    0,
  );

  // 패킷 타입 정보를 포함한 버퍼 생성
  const packetType = Buffer.alloc(config.packet.typeLength);
  packetType.writeUInt8(type, 0);

  // 길이 정보와 메시지를 함께 전송
  return Buffer.concat([packetLength, packetType, message]);
};

export const createS2CStateSyncNotificationPacket = (user) => {
  const protoMessages = getProtoMessages();
  const userStateData = protoMessages.test.GamePacket;

  const payload = {
    stateSyncNotification: {
      userGold: user.gold,
      baseHp: user.baseHp,
      monsterLevel: user.monsterLevel,
      score: user.score,
      towers: user.tower,
      monsters: user.monster,
    },
  };
  const message = userStateData.create(payload);
  const userStateDataPacket = userStateData.encode(message).finish();
  return payloadParser(PACKET_TYPE.STATE_SYNC_NOTIFICATION, user, userStateDataPacket);
};

export const createS2CUpdateBaseHPNotificationPacket = (user, isOpponent = true) => {
  const protoMessages = getProtoMessages();
  const userStateData = protoMessages.test.GamePacket;

  const payload = {
    updateBaseHpNotification: {
      isOpponent,
      baseHp: user.hp,
    },
  };
  const message = userStateData.create(payload);
  const userStateDataPacket = userStateData.encode(message).finish();
  return payloadParser(PACKET_TYPE.STATE_SYNC_NOTIFICATION, user, userStateDataPacket);
};

export const createLocationPacket = (users) => {
  const protoMessages = getProtoMessages();
  const Location = protoMessages.gameNotification.LocationUpdate;

  const payload = { users };
  const message = Location.create(payload);
  const locationPacket = Location.encode(message).finish();
  return makeNotification(locationPacket, PACKET_TYPE.LOCATION);
};

export const gameStartNotification = (gameId, timestamp) => {
  const protoMessages = getProtoMessages();
  const Start = protoMessages.gameNotification.Start;

  const payload = { gameId, timestamp };
  const message = Start.create(payload);
  const startPacket = Start.encode(message).finish();
  return makeNotification(startPacket, PACKET_TYPE.GAME_START);
};

export const createPingPacket = (timestamp) => {
  const protoMessages = getProtoMessages();
  const ping = protoMessages.common.Ping;

  const payload = { timestamp };
  const message = ping.create(payload);
  const pingPacket = ping.encode(message).finish();
  return makeNotification(pingPacket, PACKET_TYPE.PING);
};

// 서버에서 클라로 전송해야 할 매칭완료 notification
// 매개변수로는 아마 게임시작, 매칭 시작한 유저, 매칭 잡힌 상대방 유저
export const craeteS2CMatchStartNotificationPacket = (user) => {
  const protoMessages = getProtoMessages();
  const S2CMatchStartNotification = protoMessages.test.GamePacket;

  if (!S2CMatchStartNotification) {
    throw new Error('S2CMatchStartNotification 메시지가 정의되지 않았습니다.');
  }

  user.path.push({ x: 0, y: 350 });
  user.path.push({ x: 200, y: 350 });
  user.path.push({ x: 400, y: 350 });
  user.path.push({ x: 600, y: 350 });
  user.path.push({ x: 800, y: 350 });
  user.path.push({ x: 1000, y: 350 });
  user.path.push({ x: 1200, y: 350 });
  user.path.push({ x: 1370, y: 350 });

  // InitialGameState 생성
  const initialGameState = {
    baseHp: user.baseHp,
    towerCost: 10,
    initialGold: user.gold,
    monsterSpawnInterval: 2000,
  };

  // PlayerData (GameState) 생성
  const playerData = {
    gold: user.gold,
    base: { hp: user.baseHp, maxHp: user.baseMaxHp },
    highScore: user.score === 0 ? 0 : 1, // => 쿼리문으로 하이스코어 조회후 값이있으면 그값 넣기 | 1위치에 추가
    towers: user.tower,
    monsters: user.monster,
    monsterLevel: user.monsterLevel,
    score: user.score,
    monsterPath: user.path,
    basePosition: { x: 1370, y: 350 },
  };

  // Payload 생성
  const payload = {
    matchStartNotification: {
      initialGameState,
      playerData,
      opponentData: playerData, // opponentData 추가
    },
  };

  try {
    const message = S2CMatchStartNotification.create(payload);
    const MatchMakePacket = S2CMatchStartNotification.encode(message).finish();
    
    return payloadParser(PACKET_TYPE.MATCH_START_NOTIFICATION, user, MatchMakePacket);
  } catch (error) {
    console.error('패킷 생성 중 오류:', error);
    throw error;
  }
};

//game.notification.js
import { getProtoMessages } from '../../init/loadProtos.js';
import { PACKET_TYPE } from '../../constants/header.js';
import { config } from '../../config/config.js';
import { payloadParser } from '../parser/packetParser.js';
import { createResponse } from '../response/createResponse.js';
import { HANDLER_IDS } from '../../constants/handlerIds.js';

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
  const userStateData = protoMessages.gameNotification.S2CStateSyncNotification;

  const payload = {
    userGold: user.gold,
    baseHp: user.baseHp,
    monsterLevel: user.monsterLevel,
    score: user.score,
    towers: user.tower,
    monsters: user.monster,
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
  const S2CMatchStartNotification = protoMessages.test.S2CMatchStartNotification;

  if (!S2CMatchStartNotification) {
    throw new Error('S2CMatchStartNotification 메시지가 정의되지 않았습니다.');
  }

  // 매칭 완료 패킷에 담아줄 GameState / InitialGameState를 핸들러에서 만든 후 패킷 만드는 함수에 매개변수 전송
  const GameState = protoMessages.test.GameState;
  const InitialGameState = protoMessages.test.InitialGameState;

  const pay = { baseHp: 100, towerCost: 10, initialGold: 30, monsterSpawnInterval: 5 };
  const mes = InitialGameState.create(pay);
  const initialGameState = InitialGameState.encode(mes).finish();

  const pay2 = {
    gold: 30,
    base: {hp: 100, maxHp: 100},
    highScore: 0,
    towers: [],
    monsters: [],
    monsterLevel: 1,
    score: 0,
    monsterPath: [],
    basePosition: { x: 0, y: 0 },
  };
  const mes2 = GameState.create(pay2);
  const playerData = GameState.encode(mes2).finish();
  const opponentData = GameState.encode(mes2).finish();

  const payload = { initialGameState, playerData, opponentData };
  console.log('[payLoad] => ', payload);

  try {
    const message = S2CMatchStartNotification.create(payload);
    const MatchMakePacket = S2CMatchStartNotification.encode(message).finish();
      // S2CMatchStartNotification { InitialGameState initialGameState = 1; GameState playerData = 2; GameState opponentData = 3;}
      console.log(`PACKETTYPE => ${PACKET_TYPE.MATCH_START_NOTIFICATION}`);
    return payloadParser(PACKET_TYPE.MATCH_START_NOTIFICATION, user, MatchMakePacket);
    //return createResponse(HANDLER_IDS.MATCH_MAKE_REQUEST, 0, MatchMakePacket, user.id);
  } catch (error) {
    console.error('패킷 생성 중 오류:', error);
    throw error;
  }
};

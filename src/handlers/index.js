//index.js
import { HANDLER_IDS } from '../constants/handlerIds.js';
import initialHandler from './user/initial.handler.js';
import CustomError from '../utils/error/customError.js';
import { ErrorCodes } from '../utils/error/errorCodes.js';
import createGameHandler from './game/matchResponse.handler.js';
import joinGameHandler from './game/joinGame.handler.js';
import updateLocationHandler from './game/updateLocation.handler.js';
import matchRequestHandler from './game/matchRequestHandler.js';
import { PACKET_TYPE } from '../constants/header.js';
import stateSyncNotificationhandler from './game/stateSyncNotification.handler.js';
import registerHandler from './user/register.handler.js';
import loginHandler from './user/login.handler.js';
import matchResponseHandler from './game/matchResponse.handler.js';
import { handleError } from '../utils/error/errorHandler.js';
//import purchaseTowerHandler from './tower/purchaseTower.handler.js';

const handlers = {
  [HANDLER_IDS.INITIAL]: {
    handler: initialHandler,
    protoType: 'initial.InitialPacket',
  },
  [HANDLER_IDS.REGISTER]: {
    handler: registerHandler,
    protoType: 'test.C2SRegisterRequest',
  },
  [HANDLER_IDS.LOGIN]: {
    handler: loginHandler,
    protoType: 'test.C2SLoginRequest',
  },
  [HANDLER_IDS.JOIN_GAME]: {
    handler: joinGameHandler,
    protoType: 'game.JoinGamePayload',
  },
  [HANDLER_IDS.UPDATE_LOCATION]: {
    handler: updateLocationHandler,
    protoType: 'game.LocationUpdatePayload',
  },
  [HANDLER_IDS.MATCH_MAKE_REQUEST]: {
    handler: matchResponseHandler,
    protoType: 'test.S2CMatchStartNotification',
  },
  [HANDLER_IDS.MATCH_MAKE]: {
    handler: matchRequestHandler,
    protoType: 'test.C2SMatchRequest',
  },
  [PACKET_TYPE.STATE_SYNC_NOTIFICATION]: {
    handler: stateSyncNotificationhandler,
    protoType: 'gameNotification.S2CStateSyncNotification',
  },
  [HANDLER_IDS.PURCHASE_TOWER]: {
    handler: purchaseTowerHandler,
    protoType: 'test.C2STowerPurchaseRequest',
  },
  [HANDLER_IDS.ADD_ENEMY_TOWER]: {
    handler: purchaseTowerHandler/* NOT IMPLEMENTED YET, TO DO */,
    protoType: 'test.S2CAddEnemyTowerNotification',
  },
  [HANDLER_IDS.ENEMY_TOWER_ATTACK]: {
    handler: purchaseTowerHandler/* NOT IMPLEMENTED YET, TO DO */,
    protoType: 'test.S2CEnemyTowerAttackNotification',
  },
  // 다른 핸들러들을 추가
};

export const getHandlerById = (handlerId) => {
  if (!handlers[handlerId]) {
    throw new CustomError(
      ErrorCodes.UNKNOWN_HANDLER_ID,
      `핸들러를 찾을 수 없습니다: ID ${handlerId}`,
    );
  }
  return handlers[handlerId].handler;
};

export const getProtoTypeNameByHandlerId = (handlerId) => {
  if (!handlers[handlerId]) {
    // packetParser 체크하고 있지만 그냥 추가합니다.
    throw new CustomError(
      ErrorCodes.UNKNOWN_HANDLER_ID,
      `핸들러를 찾을 수 없습니다: ID ${handlerId}`,
    );
  }
  return handlers[handlerId].protoType;
};

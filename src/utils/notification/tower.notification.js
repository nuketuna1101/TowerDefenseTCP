//====================================================================================================================
//====================================================================================================================
// tower.notification.js
// server to client notification
//
// TO DO ::
// 2) 인게임 상대편유저의 타워 동기화: S2CAddEnemyTowerNotification
// 4) 상대편유저 타워의 몬스터에 대한 공격: S2CEnemyAttackNotification
//====================================================================================================================
//====================================================================================================================

import { PACKET_TYPE } from "../../constants/header.js";
import { getProtoMessages } from "../../init/loadProtos.js";
import { payloadParser } from "../parser/packetParser.js";
import { testLog } from "../testLogger.js";

//#region NOTIFICATION

// addEnemyTowerNoitification
export const addEnemyTowerNoitification = (towerId, x, y, user) => {
    const protoMsg = getProtoMessages();
    const S2CAddEnemyTowerNotification = protoMsg.test.GamePacket;
    if (!S2CAddEnemyTowerNotification) 
      throw new Error('S2CAddEnemyTowerNotification undefined.');

    const payload = { addEnemyTowerNotification: { towerId, x, y } };

    const message = S2CAddEnemyTowerNotification.create(payload);
    const packet = S2CAddEnemyTowerNotification.encode(message).finish();

    testLog(0, `[addEnemyTowerNoitification]
        payload: ${JSON.stringify(payload, null, 2)}
        message: ${JSON.stringify(message, null, 2)}
        packet: ${Array.from(packet).join(', ')}`, 'yellow');
    return payloadParser(PACKET_TYPE.ADD_ENEMY_TOWER_NOTIFICATION, user, packet);
};

// enemyTowerAttackNotification
export const enemyTowerAttackNotification = (towerId, monsterId, user) => {
    const protoMsg = getProtoMessages();
    const S2CEnemyTowerAttackNotification = protoMsg.test.GamePacket;
    if (!S2CEnemyTowerAttackNotification) 
        throw new Error('S2CEnemyTowerAttackNotification undefined.');

    const payload = { enemyTowerAttackNotification: { towerId, monsterId } };
    const message = S2CEnemyTowerAttackNotification.create(payload);
    const packet = S2CEnemyTowerAttackNotification.encode(message).finish();
    testLog(0, `[addEnemyTowerNoitification]
        payload: ${JSON.stringify(payload, null, 2)}
        message: ${JSON.stringify(message, null, 2)}
        packet: ${Array.from(packet).join(', ')}`, 'yellow');
    return payloadParser(PACKET_TYPE.ENEMY_TOWER_ATTACK_NOTIFICATION, user, packet);
};

//#endregion
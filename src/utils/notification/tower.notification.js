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

//#region NOTIFICATION

// addEnemyTowerNoitification
export const addEnemyTowerNoitification = (towerId, x, y, user) => {
    const protoMsg = getProtoMessages();
    const addEnemyTower = protoMsg.test.GamePacket;

    const payload = { AddEnemyTowerNotification: {towerId, x, y} };
    const message = addEnemyTower.create(payload);
    const packet = addEnemyTower.encode(message).finish();
    return payloadParser(PACKET_TYPE.ADD_ENEMY_TOWER_NOTIFICATION, user, packet);
};

// enemyTowerAttackNotification
export const enemyTowerAttackNotification = (towerId, monsterId, user) => {
    const protoMsg = getProtoMessages();
    const enemyTowerAttack = protoMsg.test.GamePacket;

    const payload = { EnemyTowerAttackNotification: {towerId, monsterId} };
    const message = enemyTowerAttack.create(payload);
    const packet = enemyTowerAttack.encode(message).finish();
    return payloadParser(PACKET_TYPE.ENEMY_TOWER_ATTACK_NOTIFICATION, user, packet);
};

//#endregion
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

import { PACKET_TYPE } from "../../constants/header";
import { getProtoMessages } from "../../init/loadProtos";

const makeNotification = (message, type) => {
    const packetLength = Buffer.alloc(config.packet.totalLength);
    packetLength.writeUInt32BE(
        message.length + config.packet.totalLength + config.packet.typeLength,
        0,
    );
    const packetType = Buffer.alloc(config.packet.typeLength);
    packetType.writeUInt8(type, 0);
    return Buffer.concat([packetLength, packetType, message]);
};

//#region NOTIFICATION
/*
// TO DO
export const addEnemyTowerNoitification = (towerId, x, y) => {
    const protoMsg = getProtoMessages();
    const addEnemyTower = protoMsg.gameNotification.//___// ;

    const payload = { towerId, x, y };
    const message = addEnemyTower.create(payload);
    const packet = addEnemyTower.encode(message).finish();
    return makeNotification(packet, PACKET_TYPE.//___//);
};

// TO DO
export const enemyTowerAttackNotification = () => {
    const protoMsg = getProtoMessages();
    const enemyTowerAttack = protoMsg.gameNotification.//___// ;

    const payload = { towerId, x, y };
    const message = enemyTowerAttack.create(payload);
    const packet = enemyTowerAttack.encode(message).finish();
    return makeNotification(packet, PACKET_TYPE.//___//);
};
*/
//#endregion
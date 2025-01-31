//====================================================================================================================
//====================================================================================================================
// attackRequest.handler.js
// client to server request : tower의 monster에 대한 attack
// ```cs
// packet.TowerAttackRequest = new C2STowerAttackRequest() { MonsterId = monster.monsterId, TowerId = towerId };
// ```
//====================================================================================================================

import TowerManager from "../../classes/managers/tower.manager.js";
import { getGameByUserId } from "../../session/game.session.js";
import { getUserById } from "../../session/user.session.js";
import CustomError from "../../utils/error/customError.js";
import { ErrorCodes } from "../../utils/error/errorCodes.js";
import { handleError } from "../../utils/error/errorHandler.js";
import { enemyTowerAttackNotification } from "../../utils/notification/tower.notification.js";
import { testLog } from "../../utils/testLogger.js";
import { getMonsterById } from './../../session/monster.session.js';

//====================================================================================================================
const attackRequestHandler = ({ socket, userId, payload }) => {
    try {
        // payload에서 가져오는 monster와 tower id값
        const { monsterId, towerId } = payload;

        // validation: 유저 소유 타워 존재?
        const user = getUserById(userId);
        if (!user)
            throw new CustomError(ErrorCodes.USER_NOT_FOUND, "Cannot find user");
        // const tower = TowerManager.instance.getTower(towerId);
        const tower = user.getTowerById(towerId);
        testLog(0, `Tower: ${tower} / (stringified): ${JSON.stringify(tower, null, 2)}`);
        if (!tower)
            throw new CustomError(ErrorCodes.CANNOT_FIND, "Cannot find target Tower");
        if (!tower.isOwnedBy(userId))
            throw new CustomError(ErrorCodes.NOT_AUTHORIZED_ACCESS, "tower is NOT owned by user");

        // monster 존재여부 << monster session에서 찾아오기


        // Monster class instance 를 가져와야 하는데
        const monster = user.getMonsterById(monsterId);//getMonsterByMonsterId(monsterId);//
        // if (!monster)
        //     throw new CustomError(ErrorCodes.CANNOT_FIND, "Cannot find target monster");

        // 타워의 몬스터에 대한 공격 처리
        // tower.attack(monster);


        // 유저가 자신이 속한 게임 세션 내의 유저들에게 notify

        const game = getGameByUserId(userId);
        const users = game.getUsers();
        users.forEach((user) => {
            // 자기 자신에게는 보내지 않음
            if (user.id == userId) return;
            //
            // if (!monster) return;
            const enemyTowerAttackPacket = enemyTowerAttackNotification(towerId, monsterId, user);
            user.socket.write(enemyTowerAttackPacket);
        });


        tower.attack(monster);

    } catch (error) {
        handleError(socket, error);
    }
};

export default attackRequestHandler;

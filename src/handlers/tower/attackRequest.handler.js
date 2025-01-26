//====================================================================================================================
//====================================================================================================================
// attackRequest.handler.js
// client to server request : tower의 monster에 대한 attack
// ```cs
// packet.TowerAttackRequest = new C2STowerAttackRequest() { MonsterId = monster.monsterId, TowerId = towerId };
// ```
//====================================================================================================================

import TowerManager from "../../classes/managers/tower.manager";
import CustomError from "../../utils/error/customError";
import { ErrorCodes } from "../../utils/error/errorCodes";
import { handleError } from "../../utils/error/errorHandler";

//====================================================================================================================
const attackRequestHandler = ({ socket, userId, payload }) => {
    try {
        // payload에서 가져오는 monster와 tower id값
        const { monsterId, towerId } = payload;

        // validation: 유저 소유 타워 존재?
        const user = getUserById(userId);
        if (!user)
            throw new CustomError(ErrorCodes.USER_NOT_FOUND, "Cannot find user");
        const tower = TowerManager.instance.getTower(towerId);
        if (!tower)
            throw new CustomError(ErrorCodes.CANNOT_FIND, "Cannot find target Tower");
        if (!tower.isOwnedBy(userId))
            throw new CustomError(ErrorCodes.NOT_AUTHORIZED_ACCESS, "tower is NOT owned by user");
    
        // monster 존재여부 << monster session에서 찾아오기
        const monster = getMonsterByMonsterId(monsterId);
        if (!monster)
            throw new CustomError(ErrorCodes.CANNOT_FIND, "Cannot find target monster");

        // 타워의 몬스터에 대한 공격 처리
        tower.attack(monster);
    } catch (error) {
        handleError(socket, error);
    }
};

export default attackRequestHandler;

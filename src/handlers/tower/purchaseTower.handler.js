//====================================================================================================================
//====================================================================================================================
// purchaseTower.handler.js
// client to server request : tower 구입
// ```cs
// public void OnClickAddTower()
// {
//     if (GameManager.instance.gold >= GameManager.instance.initialGameState.TowerCost)
//     {
//         GameManager.instance.gold -= GameManager.instance.initialGameState.TowerCost;
//         var pos = GameManager.instance.AddRandomTower();
//         //var tower = GameManager.instance.AddRandomTower();
//         GamePacket packet = new GamePacket();
//         packet.TowerPurchaseRequest = new C2STowerPurchaseRequest() { X = pos.x, Y = pos.y };
//         SocketManager.instance.Send(packet);
//     }
// }
// ```
//====================================================================================================================
//====================================================================================================================

import { HANDLER_IDS, RESPONSE_SUCCESS_CODE } from "../../constants/handlerIds.js";
import { v4 as uuidv4 } from 'uuid';
import { getUserById } from "../../session/user.session.js";
import TowerManager from "../../classes/managers/tower.manager.js";
import CustomError from "../../utils/error/customError.js";
import { ErrorCodes } from "../../utils/error/errorCodes.js";
import { createResponse } from "../../utils/response/createResponse.js";
import { handleError } from "../../utils/error/errorHandler.js";

// 임시로 무조건 true 반환
const isCoordinateValid = (x, y) => {
    return true;
};
let towerIdCnt = 0;

const purchaseTowerHandler = ({ socket, userId, payload }) => {
    try {
        // payload에서 가져오는 monster와 tower id값
        const { x, y } = payload;
        // TO DO
        // user 금액이 충분한지 validation
        // if ()            throw new CustomError(ErrorCodes.);
        // 배치될 위치 유효한지 validation

        // user validation
        const user = getUserById(userId);
        if (!user)
            throw new CustomError(ErrorCodes.USER_NOT_FOUND, "Cannot find user");
        // coordinate validation
        const isCoordValid = isCoordinateValid(x, y);
        if (!isCoordValid)
            throw new CustomError(ErrorCodes.MISSING_FIELDS, 'Invalid x, y coordinate');
        // 새로운 타워 id 생성
        const towerId = ++towerIdCnt;//uuidv4();
        // 1. user 클래스의 타워 배열 추가
        TowerManager.instance.addTower(userId, towerId, x, y);
        // 2. towerData로서 패킷 추가
        //#region legacy : convert into packet
        /*
        const protoMessages = getProtoMessages();
        const rawTowerData = { towerId, x, y };
        const towerData = protoMessages.test.TowerData;
        const message = towerData.create(rawTowerData);
        const towerDataPacket = towerData.encode(message).finish();
        user.addTower(towerDataPacket);
        */
        //#endregion
        const rawTowerData = { towerId, x, y };
        user.addTower(rawTowerData);


        // 타워 생성 response
        const purchaseTowerResponse = createResponse(
            HANDLER_IDS.PURCHASE_TOWER,
            RESPONSE_SUCCESS_CODE,
            { towerId: towerId },
            userId,
        );

        socket.write(purchaseTowerResponse);
    } catch (error) {
        handleError(socket, error);
    }
};

export default purchaseTowerHandler;
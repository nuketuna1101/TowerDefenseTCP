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
import { getUserById } from "../../session/user.session.js";
import TowerManager from "../../classes/managers/tower.manager.js";
import CustomError from "../../utils/error/customError.js";
import { ErrorCodes } from "../../utils/error/errorCodes.js";
import { createResponse } from "../../utils/response/createResponse.js";
import { handleError } from "../../utils/error/errorHandler.js";
import Tower from "../../classes/models/tower.class.js";
import { testLog } from "../../utils/testLogger.js";

// 임시로 무조건 true 반환
const isCoordinateValid = (x, y) => {
    return true;
};
let tower1IdCnt = 0;
let tower2IdCnt = 0;
let tower3IdCnt = 0;
let tower4IdCnt = 0;
let towerIdCounter = [-1, tower1IdCnt, tower2IdCnt, tower3IdCnt, tower4IdCnt];

const purchaseTowerHandler = ({ socket, userId, payload }) => {
    try {
        // payload에서 가져오는 monster와 tower id값
        const { x, y } = payload;
        // user validation
        const user = getUserById(userId);
        if (!user)
            throw new CustomError(ErrorCodes.USER_NOT_FOUND, "Cannot find user");

        // coordinate validation 배치될 위치 유효한지
        const isCoordValid = isCoordinateValid(x, y);
        if (!isCoordValid)
            throw new CustomError(ErrorCodes.MISSING_FIELDS, 'Invalid x, y coordinate');

        // 새로운 타워 id 생성
        let towerType = Math.floor(Math.random() * 4) + 1;

        // 임시 막아놓기
        if (towerType == 3 || towerType == 4)
            towerType = 1;

        towerIdCounter[towerType] += 1;
        const towerId = towerType * 10000 + towerIdCounter[towerType];
        // 새 타워 생성
        const tower = new Tower(userId, towerId, x, y);
        if (!tower)
            throw new CustomError(ErrorCodes.FAILED_TO_CREATE, "Failed to create tower");

        // user 금액이 충분한지 validation
        if (!user.hasEnoughGold(tower.getCost())) {
            // throw new CustomError(ErrorCodes.NOT_ENOUGH_GOLD, "Not enough gold");
            testLog(0, `[Error] Not enough gold`);
            // 타워 id 롤백
            towerIdCounter[towerType] -= 1;
            return;
        }
        user.substractGold(tower.getCost());


        // // 1. user 클래스의 타워 배열 추가
        // TowerManager.instance.addTower(userId, towerId, x, y);
        user.addTower(tower);
        // 유저가 자신이 속한 게임 세션 내의 유저들에게 notify
        TowerManager.instance.notifyEnemyTower(userId, towerId, x, y);

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
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

import { RESPONSE_SUCCESS_CODE } from "../../constants/handlerIds";
import TowerManager from "../../tmp/tower.manager";
import CustomError from "../../utils/error/customError";
import { ErrorCodes } from "../../utils/error/errorCodes";
import { createResponse } from "../../utils/response/createResponse";

const purchaseTowerHandler = ({ socket, userId, payload }) => {
    try {

        // payload에서 가져오는 monster와 tower id값
        const { towerId, x, y } = payload;

        // TO DO
        // user 금액이 충분한지 validation
        // if ()            throw new CustomError(ErrorCodes.);
        // 배치될 위치 유효한지 validation
        const isCoordinateValid = isCoordinateValid(x, y);
        if (!isCoordinateValid)
            throw new CustomError(ErrorCodes.MISSING_FIELDS, 'Invalid x, y coordinate');

        // 데이터 단 타워 추가
        TowerManager.instance.addTower(userId, towerId);
        // 타워 생성 response
        const purchaseTowerResponse = createResponse(
            /* handlerid가 packettype으로 변경 */
            RESPONSE_SUCCESS_CODE,
            { towerId, message: 'Tower Purchase completed' },
        );

        socket.write(purchaseTowerResponse);
    } catch (error) {
        handleError(socket, error);
    }
};

export default purchaseTowerHandler;
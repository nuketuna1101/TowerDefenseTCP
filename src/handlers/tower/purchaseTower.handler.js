//====================================================================================================================
//====================================================================================================================
// purchaseTower.handler.js
// client to server request : tower 구입
// ```cs
// packet.TowerAttackRequest = new C2STowerAttackRequest() { MonsterId = monster.monsterId, TowerId = towerId };
// ```
//====================================================================================================================

import { RESPONSE_SUCCESS_CODE } from "../../constants/handlerIds";
import { createResponse } from "../../utils/response/createResponse";

//====================================================================================================================
const purchaseTowerHandler = ({ socket, userId, payload }) => {
    try {

        // payload에서 가져오는 monster와 tower id값
        const { towerId } = payload;

        // TO DO

        const purchaseTowerResponse = createResponse(
            /* handlerid가 packettype으로 변경 */
            RESPONSE_SUCCESS_CODE,
            { towerId, message: '타워 구입 성공' },
        );

        socket.write(purchaseTowerResponse);
    } catch (error) {
        handleError(socket, error);
    }
};

export default purchaseTowerHandler;

//====================================================================================================================
//====================================================================================================================
// handleAttackRequest.js
// client to server request : tower의 monster에 대한 attack
// ```cs
// packet.TowerAttackRequest = new C2STowerAttackRequest() { MonsterId = monster.monsterId, TowerId = towerId };
// ```
//====================================================================================================================
//====================================================================================================================
const handleAttackRequest = ({ socket, userId, payload }) => {
    try {

        // payload에서 가져오는 monster와 tower id값
        const { monsterId, towerId } = payload;

        // TO DO

        socket.write(joinGameResponse);
    } catch (error) {
        handleError(socket, error);
    }
};

export default handleAttackRequest;

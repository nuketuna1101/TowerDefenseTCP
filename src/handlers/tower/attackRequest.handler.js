//====================================================================================================================
//====================================================================================================================
// attackRequest.handler.js
// client to server request : tower의 monster에 대한 attack
// ```cs
// packet.TowerAttackRequest = new C2STowerAttackRequest() { MonsterId = monster.monsterId, TowerId = towerId };
// ```
//====================================================================================================================
//====================================================================================================================
const attackRequestHandler = ({ socket, userId, payload }) => {
    try {

        // payload에서 가져오는 monster와 tower id값
        const { monsterId, towerId } = payload;

        // TO DO

    } catch (error) {
        handleError(socket, error);
    }
};

export default attackRequestHandler;

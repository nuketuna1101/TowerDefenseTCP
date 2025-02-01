// 1.

purchaseTowerHandler response 오류?

>> monsterId 필드가 클라이언트에서 int 자료형인 반면,
명세를 확인하지 않고 서버에서 uuid로 생성함으로 발생한 에러

=> 자료형 다시 확인하여 그에 알맞게 number increment로 처리

// 2.
purchaseTowerNotification 오류?
서버 로깅 결과 

```js
// addEnemyTowerNoitification
export const addEnemyTowerNoitification = (towerId, x, y, user) => {
    const protoMsg = getProtoMessages();
    const addEnemyTower = protoMsg.test.GamePacket;

    const payload = { AddEnemyTowerNotification: { towerId, x, y } };

    const message = addEnemyTower.create(payload);
    const packet = addEnemyTower.encode(message).finish();

    testLog(0, `[addEnemyTowerNoitification]
        payload: ${JSON.stringify(payload, null, 2)}
        message: ${JSON.stringify(message, null, 2)}
        packet: ${Array.from(packet).join(', ')}`, 'yellow');
    return payloadParser(PACKET_TYPE.ADD_ENEMY_TOWER_NOTIFICATION, user, packet);
};
```
message와 packet 로깅 부분에서
```cmd
        message: {}
        packet: 
```
로 비어있음을 확인

=> ProtoBuf 정의를 다시 확인하고, 필드명 대소문자를 점검하여 포맷 일치시키기
=> 속성명 대소문자 일치시키기 중요

즉, 변경된 코드 스니펫

```js
// addEnemyTowerNoitification
export const addEnemyTowerNoitification = (towerId, x, y, user) => {
    const protoMsg = getProtoMessages();
    const S2CAddEnemyTowerNotification = protoMsg.test.GamePacket;

    if (!S2CAddEnemyTowerNotification) 
      throw new Error('S2CAddEnemyTowerNotification undefined.');
    
    const payload = { addEnemyTowerNotification: { towerId, x, y } };

    const message = S2CAddEnemyTowerNotification.create(payload);
    const packet = S2CAddEnemyTowerNotification.encode(message).finish();

    testLog(0, `[addEnemyTowerNoitification]
        payload: ${JSON.stringify(payload, null, 2)}
        message: ${JSON.stringify(message, null, 2)}
        packet: ${Array.from(packet).join(', ')}`, 'yellow');
    return payloadParser(PACKET_TYPE.ADD_ENEMY_TOWER_NOTIFICATION, user, packet);
};
```
## monster.class.js
-monsterDead(userId) 몬스터 사망시 C2SMonsterDeathNotification 형태의 패킷을 만들고 removeMonster호출<br>
-removeMonster(userId, monsterId) 유저의 monsters배열에서 제거<br>
-spawnMonster(id, monsterNum, user) 몬스터객체 생성후 user.addMonster를 호출해 user의 monsters배열에 추가<br>
## monster.handler.js
-spawnMonsterReqHandler C2SSpawnMonsterRequest을 받으면 실행 스코어별로 몬스터의 레벨과 종류를 바꿔서 스폰하고 response와 notification를 각 클라이언트에 전송<br>
-monsterDeathNotificationHandler C2SMonsterDeathNotification를 받으면 실행, 받은 몬스터 Id를 상대클라에 S2CEnemyMonsterDeathNotification형태로 보내준다.<br>
## monster.notification.js
-createS2CSpawnMonsterResponse 클라로 보낼S2CSpawnMonsterResponse패킷 생성<br>
-createS2CSpawnEnemyMonsterNotification 클라로 보낼S2CSpawnEnemyMonsterNotification패킷 생성<br>
-createS2CEnemyMonsterDeathNotification 클라로 보낼S2CEnemyMonsterDeathNotification패킷 생성<br>

## monster.session.js
-addMonster monstersessions에 monster객체 추가
-removeMonster monstersessions에서 monster객체 삭제
-getMonsterById monstersessions에서 monster객체 조회
## findUserGameOppnent.js
-findUserGameOpponentBySocket socket으로 user,game,opponent찾아주는 함수

## 몬스터 관련 패킷타입
```
message GamePacket {
    oneof payload {
        ...
        ...
        // 몬스터 생성
        C2SSpawnMonsterRequest spawnMonsterRequest = 11;
        S2CSpawnMonsterResponse spawnMonsterResponse = 12;
        S2CSpawnEnemyMonsterNotification spawnEnemyMonsterNotification = 13;
        ...
        ...
        ...
        // 몬스터 사망 통지
        C2SMonsterDeathNotification monsterDeathNotification = 20;
        S2CEnemyMonsterDeathNotification enemyMonsterDeathNotification = 21;
        ...
    }
}

message C2SSpawnMonsterRequest {
}

message S2CSpawnMonsterResponse {
    int32 monsterId = 1; 
    int32 monsterNumber = 2;
}

message S2CSpawnEnemyMonsterNotification {
    int32 monsterId = 1; 놀랍게도 얘가 고유번호
    int32 monsterNumber = 2;  놀랍게도 얘가 종류 (1~5)5가지
}

message C2SMonsterAttackBaseRequest {
    int32 damage = 1;
}

message C2SMonsterDeathNotification {
    int32 monsterId = 1;
}

message S2CEnemyMonsterDeathNotification {
    int32 monsterId = 1;
}```

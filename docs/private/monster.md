패킷타입
message GamePacket {
    oneof payload {
        // 회원가입 및 로그인
        C2SRegisterRequest registerRequest = 1;
        S2CRegisterResponse registerResponse = 2;
        C2SLoginRequest loginRequest = 3;
        S2CLoginResponse loginResponse = 4;

        // 매칭
        C2SMatchRequest matchRequest = 5;
        S2CMatchStartNotification matchStartNotification = 6;

        // 상태 동기화
        S2CStateSyncNotification stateSyncNotification = 7;

        // 타워 구입 및 배치
        C2STowerPurchaseRequest towerPurchaseRequest = 8;
        S2CTowerPurchaseResponse towerPurchaseResponse = 9;
        S2CAddEnemyTowerNotification addEnemyTowerNotification = 10;

        // 몬스터 생성
        C2SSpawnMonsterRequest spawnMonsterRequest = 11;
        S2CSpawnMonsterResponse spawnMonsterResponse = 12;
        S2CSpawnEnemyMonsterNotification spawnEnemyMonsterNotification = 13;

        // 전투 액션
        C2STowerAttackRequest towerAttackRequest = 14;
        S2CEnemyTowerAttackNotification enemyTowerAttackNotification = 15;
        C2SMonsterAttackBaseRequest monsterAttackBaseRequest = 16;

        // 기지 HP 업데이트 및 게임 오버
        S2CUpdateBaseHPNotification updateBaseHpNotification = 17;
        S2CGameOverNotification gameOverNotification = 18;

        // 게임 종료  
        C2SGameEndRequest gameEndRequest = 19;

        // 몬스터 사망 통지
        C2SMonsterDeathNotification monsterDeathNotification = 20;
        S2CEnemyMonsterDeathNotification enemyMonsterDeathNotification = 21;
    }
}





GameManager.cs

// 몬스터 추가 메서드
public void AddMonster(MonsterData data, ePlayer player)
{
    // 플레이어에 따라 도로 리스트 선택
    var roads = player == ePlayer.me ? roads1 : roads2;
    
    // 몬스터 인스턴스화
    var mon = Instantiate(ResourceManager.instance.LoadAsset<Monster>("Monster"), roads[0].position, new Quaternion());
    
    // 몬스터 리스트에 추가
    monsters.Add(mon);
    
    // 몬스터 ID 설정
    mon.monsterId = data.MonsterId;
    
    // 플레이어 설정
    mon.player = player;
    
    // 레벨 설정
    mon.SetLevel(DataManager.instance.GetData<MonsterDataSO>("MON0000" + data.MonsterNumber), data.Level);
}

// 몬스터 제거 메서드 (ID로)
public void RemoveMonster(int monsterId)
{
    // null 몬스터 제거
    monsters.RemoveAll(obj => obj == null);
    
    // 타겟 몬스터 찾기
    var targetMonster = monsters.Find(obj => obj.monsterId == monsterId);
    
    // 타겟 몬스터가 존재하는 경우
    if (targetMonster != null)
    {
        // 인덱스 찾기
        var idx = monsters.IndexOf(targetMonster);
        
        // 몬스터 사망 시
        StartCoroutine(targetMonster.OnDeath(monster =>
        {
            // 몬스터가 null인 경우
            if (monster == null)
            {
                // 리스트에서 제거
                monsters.RemoveAt(idx);
            }
            else
            {
                // 몬스터 제거
                monsters.Remove(monster);
            }
        }));
    }
}

// 몬스터 제거 메서드 (몬스터 객체로)
public void RemoveMonster(Monster monster)
{
    // 몬스터 리스트에서 제거
    monsters.Remove(monster);
}

SocketManager.cs

// 적 몬스터 사망 알림 처리 메서드
public void EnemyMonsterDeathNotification(GamePacket gamePacket)
{
    // 게임 패킷에서 응답을 가져옴
    var response = gamePacket.EnemyMonsterDeathNotification;
    
    // GameManager를 통해 몬스터 제거
    GameManager.instance.RemoveMonster(response.MonsterId);
}

// 적 몬스터 생성 알림 처리 메서드
public void SpawnEnemyMonsterNotification(GamePacket gamePacket)
{
    // 게임 패킷에서 응답을 가져옴
    var response = gamePacket.SpawnEnemyMonsterNotification;
    
    // GameManager를 통해 몬스터 추가
    GameManager.instance.AddMonster(new MonsterData() { MonsterId = response.MonsterId, MonsterNumber = response.MonsterNumber, Level = GameManager.instance.level }, ePlayer.another);
}

// 몬스터 생성 응답 처리 메서드
public void SpawnMonsterResponse(GamePacket gamePacket)
{
    // 게임 패킷에서 응답을 가져옴
    var response = gamePacket.SpawnMonsterResponse;
    
    // GameManager를 통해 몬스터 추가
    GameManager.instance.AddMonster(new MonsterData() { MonsterId = response.MonsterId, MonsterNumber = response.MonsterNumber, Level = GameManager.instance.level }, ePlayer.me);
}

Packet.cs

// 몬스터 생성 요청
SPAWN_MONSTER_REQUEST = 11,
// 몬스터 생성 응답
SPAWN_MONSTER_RESPONSE = 12,
// 적 몬스터 생성 알림
SPAWN_ENEMY_MONSTER_NOTIFICATION = 13,

// 적 타워 공격 알림
ENEMY_TOWER_ATTACK_NOTIFICATION = 15,
// 몬스터 기지 공격 요청
MONSTER_ATTACK_BASE_REQUEST = 16,

// 기지 HP 업데이트 알림
UPDATE_BASE_HP_NOTIFICATION = 17,

// 몬스터 사망 알림
MONSTER_DEATH_NOTIFICATION = 20,
// 적 몬스터 사망 알림
ENEMY_MONSTER_DEATH_NOTIFICATION = 21,

Monster.cs

// 충돌 처리 메서드
public void OnCollisionEnter2D(Collision2D collision)
{
    // 충돌한 객체의 태그가 "EndPoint"인 경우
    if (collision.transform.tag == "EndPoint")
    {
        // 게임이 시작되었고 플레이어가 나인 경우
        if (GameManager.instance.isGameStart &&
            player == ePlayer.me)
        {
            // 몬스터 기지 공격 요청 패킷 생성
            GamePacket packet = new GamePacket();
            packet.MonsterAttackBaseRequest = new C2SMonsterAttackBaseRequest() { Damage = atk };
            
            // 패킷 전송
            SocketManager.instance.Send(packet);
        }
        
        // GameManager를 통해 몬스터 제거
        GameManager.instance.RemoveMonster(this);
        
        // HP 게이지와 몬스터 객체 제거
        Destroy(hpGauge.gameObject);
        Destroy(gameObject);
    }
}
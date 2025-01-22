# assigned task
Tower 관련 담당

<br>

---

### Server side에서 Tower에 대한 관리가 필요한 부분

1) 타워 구매: C2STowerPurchaseRequest, S2CTowerPurchaseResponse

2) 인게임 상대편유저의 타워 동기화: S2CAddEnemyTowerNotification

3) 타워의 몬스터에 대한 공격: C2STowerAttackRequest

4) 상대편유저 타워의 몬스터에 대한 공격: S2CEnemyAttackNotification

<br>

### 사용하는 packetType

```js
const PacketType = {
    /* 중략 */
    // 타워 구입 및 배치
    TOWER_PURCHASE_REQUEST: 8,
    TOWER_PURCHASE_RESPONSE: 9,
    ADD_ENEMY_TOWER_NOTIFICATION: 10,
    // 전투 액션
    TOWER_ATTACK_REQUEST: 14,
    ENEMY_TOWER_ATTACK_NOTIFICATION: 15,
    /* 중략 */
};
```

---

```proto3
syntax = "proto3";

message TowerData {
    int32 towerId = 1;
    float x = 2;
    float y = 3;
}

message C2STowerPurchaseRequest {
    float x = 1;
    float y = 2;
}

message S2CTowerPurchaseResponse {
    int32 towerId = 1;
}

message S2CAddEnemyTowerNotification {
    int32 towerId = 1;
    float x = 2;
    float y = 3;
}

message C2STowerAttackRequest {
    int32 towerId = 1;
    int32 monsterId = 2;
}

message S2CEnemyTowerAttackNotification {
    int32 towerId = 1;
    int32 monsterId = 2;
}
```

---

**모든 구현은 기본적으로 client단 skeleton code 기반해야 한다.**

Client Side Codes

```cs
// ScriptableObject인 TowerDataSO.cs
[CreateAssetMenu(fileName = "TowerData", menuName = "ScriptableObjects/TowerData")]
public class TowerDataSO : BaseDataSO
{
    public int power;
    public int powerPerLv;
    public int range;
    public float cooldown;
    public int duration;
    public int cost;
    public float extra;
    public float extraPerLv;
}
```


```cs
// Tower 클래스: Tower 프리팹에 붙은 스크립트
public class Tower : WorldBase<TowerDataSO>
{
    [SerializeField] private Transform beamPosition;
    private bool isAttackDelay = false;
    int level;
    public int power { get => data.power + data.powerPerLv * level; }
    public float extra { get => data.extra + data.extraPerLv * level; }
    public int towerId;
    public ePlayer player;
    bool isStop = false;

    public override void Init(BaseDataSO data)
    {
        this.data = (TowerDataSO)data;
    }

    private void Awake()
    {
        data = DataManager.instance.GetData<TowerDataSO>("TOW00001");
    }

    private void OnTriggerStay2D(Collider2D collision)
    {
        if (isAttackDelay || player == ePlayer.another || isStop) return;
        if (collision.gameObject.TryGetComponent(out Monster monster))
        {
            OnAttackMonster(monster);
        }
    }

    public void OnAttackMonster(Monster monster)
    {
        if (monster == null) return;
        var beam = Instantiate(ResourceManager.instance.LoadAsset<BeamObject>("BeamObject"), beamPosition).SetTimer().SetTarget(monster);
        isAttackDelay = true;
        monster.SetDamage(power);
        if (player == ePlayer.me)
        {
            StartCoroutine(OnCooldown());
            // [!] towerattack packet 전송
            GamePacket packet = new GamePacket();
            packet.TowerAttackRequest = new C2STowerAttackRequest() { MonsterId = monster.monsterId, TowerId = towerId };
            SocketManager.instance.Send(packet);
        }
    }

    public IEnumerator OnCooldown()
    {
        yield return new WaitForSeconds(data.cooldown / 60);
        isAttackDelay = false;
    }

    public void StopTower()
    {
        isStop = true;
    }
}


```
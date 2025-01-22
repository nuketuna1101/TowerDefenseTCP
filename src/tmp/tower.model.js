//====================================================================================================================
//====================================================================================================================
// tower.model.js
// 데이터 구조로서의 타워 모델
// memo: 우선 bruteforce하게 구현했지만 attack을 c2s로 받기 때문에 수정해야할듯!
//#region client side towerSO
// ```
// public int power;
// public int powerPerLv;
// public int range;
// public float cooldown;
// public int duration;
// public int cost;
// public float extra;
// public float extraPerLv;
// ```
//#endregion
//====================================================================================================================
//====================================================================================================================

import { distance } from '../utils/mathHelper.js';
import { testLog } from './../utils/testLogger.js';

class Tower {
    constructor(userId, towerTypeId, x, y) {
        // 식별자 id
        this.id = id;
        // 입력값 기반 초기화
        this.userId = userId;
        this.towerTypeId = towerTypeId;
        this.x = x;
        this.y = y;
        // 초기화 수치 일단 하드코딩 => 추후 리팩토링
        this.power = 40;
        this.powerPerLv = 10;
        this.range = 300;
        this.cooldown = 180;
        this.duration = 30;
        this.cost = 3000;
        this.extra = 1;
        this.extraPerLv = 0.5;
        //
        this.isStop = false;
        this.isAttackDelay = false;
    }

    attack(monster) {
        // 공격 가능한지
        if (this.isStop || this.isAttackDelay) {
            testLog(0, "[Tower] cannot attack :: isAttackDelay or isStop", 'blue');
            return;
        }
        // 거리 유효 계산
        const distance = distance(this.x, this.y, monster.x, monster.y);
        if (this.range < distance) {
            testLog(0, "[Tower] cannot attack :: OUT OF RANGE", 'blue');
            return;
        }

        // 몬스터 피격 처리 (임시)
        monster.beAttacked(this.power);
    }

    stop() {

    }



}

export default Tower;

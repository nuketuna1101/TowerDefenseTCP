//====================================================================================================================
//====================================================================================================================
// tower.class.js
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

import { testLog } from '../../utils/testLogger.js';
import { getDistance } from '../../utils/mathHelper.js';
import { enemyTowerAttackNotification } from './../../utils/notification/tower.notification.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import { towerAssets } from './../../constants/tower.assets.js';
import { getGameByUserId } from '../../session/game.session.js';

class Tower {
    constructor(userId, towerId, x, y, towerTypeCode = 'TOW00001') {
        // 식별자 id
        this.id = towerId;
        // 입력값 기반 초기화
        this.userId = userId;
        this.x = x;
        this.y = y;
        // 초기화 수치 일단 하드코딩 => 추후 리팩토링
        this.towerTypeCode = towerTypeCode;
        // 타입별 속성 가져오기
        const towerTypeData = towerAssets[towerTypeCode];
        if (!towerTypeData) 
            throw new CustomError(ErrorCodes.INVALID_DATA, `Invalid tower type: ${towerTypeCode}`);
        
        this.power = towerTypeData.power;
        this.powerPerLv = towerTypeData.powerPerLv;
        this.range = towerTypeData.range;
        this.cooldown = towerTypeData.cooldown;
        this.duration = towerTypeData.duration;
        this.cost = towerTypeData.cost;
        this.extra = towerTypeData.extra;
        this.extraPerLv = towerTypeData.extraPerLv;
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
        const distance = getDistance(this.x, this.y, monster.x, monster.y);
        if (this.range < distance) {
            testLog(0, "[Tower] cannot attack :: OUT OF RANGE", 'blue');
            return;
        }

        // 몬스터 피격 처리 (임시)
        // monster.beAttacked(this.power);

        // 유저가 자신이 속한 게임 세션 내의 유저들에게 notify
        const game = getGameByUserId(this.userId);
        const users = game.getUsers();
        users.forEach((user) => {
            // 자기 자신에게는 보내지 않음
            if (user.id !== this.userId) {
                const enemyTowerAttackPacket = enemyTowerAttackNotification(this.id, monster.id, user);
                user.socket.write(enemyTowerAttackPacket);
            }
        });
    }

    stop() {

    }

    isOwnedBy(userId) {
        return this.userId == userId;
    }


    //#region getter
    getCost(){
        return this.cost;
    }
    //#endregion

}

export default Tower;

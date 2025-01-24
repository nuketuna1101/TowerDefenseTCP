//====================================================================================================================
//====================================================================================================================
// base.class.js
// 데이터 구조로서의 기지 베이스 클래스
//====================================================================================================================
//====================================================================================================================

import { userInit } from '../../constants/userConstants.js';

class Base {
    constructor(userId, baseId, x, y) {
        // 식별자 id
        this.id = baseId;
        // 입력값 기반 초기화
        this.userId = userId;
        this.x = x;
        this.y = y;
        // 초기화 수치 일단 하드코딩 => 추후 리팩토링
        this.maxHp = userInit.baseHp || 100;
        this.curHp = this.maxHp;
        //
        this.isDestroyed = false;
    }

    takeDamage(damage){
        this.curHp -= damage;
        isDestroyed = this.curHp <= 0;
    }

    getCurHp(){
        return this.curHp;
    }
}

export default Base;

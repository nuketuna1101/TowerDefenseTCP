//====================================================================================================================
//====================================================================================================================
// tower.manager.js
// 개요: client request로부터의 tower 로직 처리
// 1. 서버 구동 시 초기화. => 서버 구동시 싱글턴으로 유지
// 2. 유저/클라이언트 disconnect 시 해당 유저/클라이언트의 모든 towers 내 저장 타워 해제
// - 타워 데이터 저장형태: {userId, data: ...} 원소로 갖는 배열
//====================================================================================================================
//====================================================================================================================

import Tower from "../models/tower.class.js";

class TowerManager {
    static instance = null;
    // 생성자
    constructor() {
        if (!TowerManager.instance) {
            this.towers = [];
            // 인스턴스
            TowerManager.instance = this;
        }
        return TowerManager.instance;
    }

    // 초기화
    static initialize() {
        if (!TowerManager.instance)
            new TowerManager();
        else
            TowerManager.instance.towers = [];
        return TowerManager.instance;
    }

    // 타워 추가: 우선은 자체적으로 랜덤한 위치 내에서
    addTower(userId, towerId, x, y) {
        // 저장할 data: 
        const tower = new Tower(userId, towerId, x, y);
        this.towers.push(tower);
        // const towerData = { towerId, x, y };
        // this.towers.push({ tower, towerData });
    }

    removeTower(towerId) {

    }

    // user/client disconnected 시 모든 타워 해제
    freeAllTowers(userId) {

    }

    handleTowerPurchase() {
        // request: C2STowerPurchaseRequest
        // response: S2CTowerPurchaseResponse
    }

    handleTowerAttack() {
        // request: C2STowerAttackRequest
    }

    handleEnemyAttackNotification() {
        // S2CEnemyAttackNotification
    }
}


export default TowerManager;

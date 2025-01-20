//====================================================================================================================
//====================================================================================================================
// tower.manager.js
// client request로부터의 tower 로직 처리
//====================================================================================================================
//====================================================================================================================

class TowerManager {
    static instance = null;

    constructor() {
        if (!TowerManager.instance) {
            this.towers = [];
            // 인스턴스
            TowerManager.instance = this;
        }
        return TowerManager.instance;
    }

    addTower(tower) {

    }

    removeTower(towerId) {

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

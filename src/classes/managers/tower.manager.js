//====================================================================================================================
//====================================================================================================================
// tower.manager.js
// 개요: client request로부터의 tower 로직 처리
// 1. 서버 구동 시 초기화. => 서버 구동시 싱글턴으로 유지
// 2. 유저/클라이언트 disconnect 시 해당 유저/클라이언트의 모든 towers 내 저장 타워 해제
// - 타워 데이터 저장형태: {userId, data: ...} 원소로 갖는 배열
//====================================================================================================================
//====================================================================================================================

import { getGameByUserId } from "../../session/game.session.js";
import { addEnemyTowerNoitification } from "../../utils/notification/tower.notification.js";
import { testLog } from "../../utils/testLogger.js";
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
        //#region legacy tmp
        // const towerData = { towerId, x, y };
        // this.towers.push({ tower, towerData });
        //#endregion

        // 저장할 data
        const tower = new Tower(userId, towerId, x, y);
        this.towers.push(tower);

        // 유저가 자신이 속한 게임 세션 내의 유저들에게 notify
        const game = getGameByUserId(userId);
        const users = game.getUsers();
        try {
            users.forEach((user) => {
                // 자기 자신에게는 보내지 않음
                if (user.id == userId) return;
                const addEnemyTowerPacket = addEnemyTowerNoitification(towerId, x, y, user);
                user.socket.write(addEnemyTowerPacket);
            });
        } catch(error){
            testLog(0, `[Error] addEnemyTowerNoitification packet failed`, 'red');
            throw error;
        }
    }

    removeTower(towerId) {
        this.towers = this.towers.filter(tower => tower.id !== towerId);
    }

    // user/client disconnected 시 모든 타워 해제
    freeAllTowers(userId) {
        this.towers = this.towers.filter(tower => tower.userId !== userId);
    }


    //#region GETTER 메서드
    getTower(towerId){
        return this.towers.find(tower => tower.id === towerId);
    }

    getTowersByUser(userId){
        return this.towers.filter(tower => tower.userId === userId);
    }
    //#endregion

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

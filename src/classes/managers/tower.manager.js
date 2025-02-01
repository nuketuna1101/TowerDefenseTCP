//====================================================================================================================
//====================================================================================================================
// tower.manager.js
// 개요: client request로부터의 tower 로직 처리
// 1. 서버 구동 시 초기화. => 서버 구동시 싱글턴으로 유지
// 2. 유저/클라이언트 disconnect 시 해당 유저/클라이언트의 모든 towers 내 저장 타워 해제
// - 타워 데이터 저장형태: {userId, data: ...} 원소로 갖는 배열


// TO DO: TowerManager에서 towers 저장 관리하지 않고 작업 처리만 하기 때문에 관련 코드 리팩토링해야함 / 다른 메서드 towers 사용하는 거 전부 폐기
//====================================================================================================================
//====================================================================================================================

import { getGameByUserId } from "../../session/game.session.js";
import { getUserById } from "../../session/user.session.js";
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

    // 팩토리 역할로 타워 생성
    createTower(userId, towerId, x, y) {
        const tower = new Tower(userId, towerId, x, y);
        return tower;
    }

    addTowerToUser(user, tower) {
        user.addTower(tower);
    }

    removeTowerFromUser(user, tower){
        //
    }


    //#region Legacy : tower manager가 관리하는 towers에 대한 관리
    removeTower(towerId) {
        this.towers = this.towers.filter(tower => tower.id !== towerId);
    }

    // user/client disconnected 시 모든 타워 해제
    freeAllTowers(userId) {
        this.towers = this.towers.filter(tower => tower.userId !== userId);
    }
    //#endregion

    //#region GETTER 메서드
    getTower(towerId) {
        return this.towers.find(tower => tower.id === towerId);
    }

    getTowersByUser(userId) {
        return this.towers.filter(tower => tower.userId === userId);
    }
    //#endregion

    // 유저가 자신이 속한 게임 세션 내의 유저들에게 notify
    notifyEnemyTower(userId, towerId, x, y) {
        // request: C2STowerPurchaseRequest
        // response: S2CTowerPurchaseResponse
        const game = getGameByUserId(userId);
        const users = game.getUsers();
        try {
            users.forEach((user) => {
                // 자기 자신에게는 보내지 않음
                if (user.id == userId) return;
                const addEnemyTowerPacket = addEnemyTowerNoitification(towerId, x, y, user);
                user.socket.write(addEnemyTowerPacket);
            });
        } catch (error) {
            testLog(0, `[Error] addEnemyTowerNoitification packet failed`, 'red');
            throw error;
        }
    }
}


export default TowerManager;

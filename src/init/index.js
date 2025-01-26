//index.js
// 서버 초기화 작업
import { loadGameAssets } from './assets.js';
import { loadProtos } from './loadProtos.js';
import { testAllConnections } from '../utils/db/testConnection.js';
import pools from '../db/database.js';
import TowerManager from '../classes/managers/tower.manager.js';

const initServer = async () => {
  try {
    //await loadGameAssets();
    await loadProtos();
    await testAllConnections(pools);
    //#region 싱글턴 TowerManager의 초기화
    TowerManager.initialize();
    //#endregion

    // 다음 작업
  } catch (e) {
    console.error(e);
    process.exit(1); // 오류 발생 시 프로세스 종료
  }
};

export default initServer;

//====================================================================================================================
//====================================================================================================================
// utils/testLogger.js
// 테스트 환경에서만 사용하도록 만든 테스트 로거
//====================================================================================================================
//====================================================================================================================
import chalk from 'chalk';

// 테스트 로그 보일지 말지 결정할 플래그 부울
const flag = false;

// param: 전체 visibility용 index, 컨텐츠 msg, 개별 visibility용 manualFlag, 로그 색상용 color
export const testLog = (index = 0, msg, color = 'default', manualFlag = true) => {
    // 보여주기 숨기기 플래그
    if (!flag || !manualFlag) return;
    let logMsg = "[TestLogger]: " + msg;

    // 색상
    switch (color) {
        case 'red':
            logMsg = chalk.red(logMsg);
            break;
        case 'yellow':
            logMsg = chalk.yellow(logMsg);
            break;
        case 'green':
            logMsg = chalk.green(logMsg);
            break;
        case 'blue':
            logMsg = chalk.blue(logMsg);
            break;
        default:
            logMsg = chalk.white(logMsg);
            break;
    }

    switch (index) {
        case 0:
            console.log(logMsg);
            break;
        case 1:
            console.error(logMsg);
            break;
        case 2:
            console.warn(logMsg);
            break;
        case 3:
            console.info(logMsg);
            break;
    }
}
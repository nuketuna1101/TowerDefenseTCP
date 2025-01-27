import { testLog } from '../utils/testLogger.js';
import { monsterSessions } from './sessions.js';

export const addMonster = (monster) => {
  monsterSessions.push(monster);
  return monster;
};

export const removemonster = (monsterId) => {
  const index = monsterSessions.findIndex((monster) => monster.id === monsterId);
  if (index !== -1) {
    return monsterSessions.splice(index, 1)[0];
  }
};

export const getMonsterById = (monsterId) => {
  // return monsterSessions.find((monster) => {
  //   testLog(0, `monster: ${monster} | ${JSON.stringify(monster)}\n
  //     monster.id: ${monster.id}\n
  //     is equal?: ${monster.id === monsterId}`);
  //     return (monster.id === monsterId);
  // });
  return monsterSessions.find((monster) => (monster.id === monsterId));
};
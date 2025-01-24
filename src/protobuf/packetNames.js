//packetNames.js
export const packetNames = {
  common: {
    Packet: 'common.Packet',
    Ping: 'common.Ping'
  },
  initial: {
    InitialPacket: 'initial.InitialPacket'
  },
  game: {
    CreateGamePayload: 'game.CreateGamePayload',
    JoinGamePayload: 'game.JoinGamePayload',
    LocationUpdatePayload: 'game.LocationUpdatePayload'
  },
  gameNotification: {
    LocationUpdate: 'gameNotification.LocationUpdate',
    Start: 'gameNotification.Start',
    S2CStateSyncNotification: 'gameNotification.S2CStateSyncNotification',
  },
  test: {
    InitialGameState: 'test.InitialGameState',
    GameState: 'test.GameState',
    GamePacket: 'test.GamePacket',            // GamePacket 추가
    TowerData: 'test.TowerData',
    C2SRegisterRequest: 'test.C2SRegisterRequest',
    S2CRegisterResponse: 'test.S2CRegisterResponse',
    C2SLoginRequest: 'test.C2SLoginRequest',
    S2CLoginResponse: 'test.S2CLoginResponse',
    C2SMatchRequest: 'test.C2SMatchRequest',
    S2CMatchStartNotification: 'test.S2CMatchStartNotification',
    C2STowerPurchaseRequest: 'test.C2STowerPurchaseRequest',
    S2CAddEnemyTowerNotification: 'test.S2CAddEnemyTowerNotification',
    S2CEnemyTowerAttackNotification: 'test.S2CEnemyTowerAttackNotification',
  },

  response: {
    Response: 'response.Response'
  },
};

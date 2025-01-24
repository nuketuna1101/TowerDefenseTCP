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
    BaseData: 'test.BaseData',
    Position: 'test.Position',
    TowerData: 'test.TowerData',
    C2SRegisterRequest: 'test.C2SRegisterRequest',
    S2CRegisterResponse: 'test.S2CRegisterResponse',
    C2SLoginRequest: 'test.C2SLoginRequest',
    S2CLoginResponse: 'test.S2CLoginResponse',
    C2SMatchRequest: 'test.C2SMatchRequest',
    S2CMatchStartNotification: 'test.S2CMatchStartNotification',
    C2STowerPurchaseRequest: 'test.C2STowerPurchaseRequest',
    S2CStateSyncNotification: 'test.S2CStateSyncNotification',
    S2CUpdateBaseHPNotification: 'test.S2CUpdateBaseHPNotification',
    S2CGameOverNotification: 'test.S2CGameOverNotification',
    C2SGameEndRequest: 'test.C2SGameEndRequest',
  },

  response: {
    Response: 'response.Response'
  },
};

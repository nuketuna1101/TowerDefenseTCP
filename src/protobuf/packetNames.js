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
    GamePacket: 'test.GamePacket',            // GamePacket 추가
    C2SRegisterRequest: 'test.C2SRegisterRequest',
    S2CRegisterResponse: 'test.S2CRegisterResponse',
    C2SLoginRequest: 'test.C2SLoginRequest',
    S2CLoginResponse: 'test.S2CLoginResponse'
  },
  response: {
    Response: 'response.Response'
  },
  matchMakeNotification: {
    MatchMake: 'matchMakeNotification.S2CMatchStartNotification',
  },
};

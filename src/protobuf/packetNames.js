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
    RegisterRequest: 'test.C2SRegisterRequest',
    RegisterResponse: 'test.S2CRegisterResponse',
    LoginRequest: 'test.C2SLoginRequest',
    LoginResponse: 'test.S2CLoginResponse'
  },
  response: {
    Response: 'response.Response'
  },
  matchMakeNotification: {
    MatchMake: 'matchMakeNotification.S2CMatchStartNotification',
  },
};

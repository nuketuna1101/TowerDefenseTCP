//errorCodes.js
export const ErrorCodes = {
  CLIENT_VERSION_MISMATCH: 10001,
  UNKNOWN_HANDLER_ID: 10002,
  PACKET_DECODE_ERROR: 10003,
  PACKET_STRUCTURE_MISMATCH: 10004,
  MISSING_FIELDS: 10005,
  USER_NOT_FOUND: 10006,
  INVALID_PACKET: 10007,
  INVALID_SEQUENCE: 10008,
  GAME_NOT_FOUND: 10009,
  EMAIL_ALREADY_EXISTS: 10010,
  NICKNAME_ALREADY_EXISTS: 10011,
  INVALID_CREDENTIALS: 10012,
  INVALID_PASSWORD: 10013,
  //#region Tower 관련 에러 코드
  CANNOT_FIND: 20001,
  INVALID_DATA: 20002,
  NOT_AUTHORIZED_ACCESS: 20003,
  //#endregion
  // 추가적인 에러 코드들
};

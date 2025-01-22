//config.js
import {
  PORT,
  HOST,
  CLIENT_VERSION,
  DB1_NAME,
  DB1_USER,
  DB1_PASSWORD,
  DB1_HOST,
  DB1_PORT,
  DB2_NAME,
  DB2_USER,
  DB2_PASSWORD,
  DB2_HOST,
  DB2_PORT
} from '../constants/env.js';
import { PACKET_TYPE_LENGTH, TOTAL_LENGTH } from '../constants/header.js';


export const config = {
  server: {
    port: PORT,
    host: HOST,
  },
  client: {
    version: '1.0.0',  // 클라이언트 버전과 일치
  },
  packet: {
    headerSize: 11,    // 2(type) + 1(version length) + 4(sequence) + 4(payload length)
    typeLength: 2,     // 패킷 타입 정보 (2바이트)
    versionLength: 1,  // 버전 길이 정보 (1바이트)
    sequenceLength: 4, // 시퀀스 번호 길이 (4바이트)
    payloadLength: 4,  // 페이로드 길이 정보 (4바이트)
  },
  databases: {
    GAME_DB: {
      name: DB1_NAME || 'game_db',
      user: DB1_USER || 'root',
      password: DB1_PASSWORD || '1234',
      host: DB1_HOST || 'localhost',
      port: parseInt(DB1_PORT) || 3306,
    },
    USER_DB: {
      name: DB2_NAME,
      user: DB2_USER,
      password: DB2_PASSWORD,
      host: DB2_HOST,
      port: parseInt(DB2_PORT),
    }
  }
};
import { PORT, HOST, CLIENT_VERSION } from '../constants/env.js';
import { PACKET_TYPE_LENGTH, TOTAL_LENGTH, SEQUENCE_LENGTH, VERSION_LENGTH_LENGTH, PAYLOAD_LENGTH_LENGTH } from '../constants/header.js';
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
    version: CLIENT_VERSION,
  },
  packet: {
//     totalLength: TOTAL_LENGTH,
//     packetTypeLength: PACKET_TYPE_LENGTH,
//     versionLengthLength: VERSION_LENGTH_LENGTH,
//     sequenceLength: SEQUENCE_LENGTH,
//     payloadLengthLength: PAYLOAD_LENGTH_LENGTH,
    totalLength: 4,         // 패킷 길이 정보 (4바이트)
    typeLength: 1,          // 패킷 타입 정보 (1바이트)
    versionLength: 8,       // 버전 정보 길이 (8바이트)
    handlerIdLength: 4,     // 핸들러 ID 길이 (4바이트)
    sequenceLength: 4,      // 시퀀스 길이 (4바이트)
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
      name: DB2_NAME || 'user_db',
      user: DB2_USER || 'root',
      password: DB2_PASSWORD || '1234',
      host: DB2_HOST || 'localhost',
      port: parseInt(DB2_PORT) || 3306,
    }
  }
};


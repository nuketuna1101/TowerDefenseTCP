// onData.js
import { packetParser } from '../utils/parser/packetParser.js';
import { getHandlerById } from '../handlers/index.js';
import { getGameByUser } from '../session/game.session.js';
import { getUserById, getUserBySocket } from '../session/user.session.js';
import { handleError } from '../utils/error/errorHandler.js';
import CustomError from '../utils/error/customError.js';
import { ErrorCodes } from '../utils/error/errorCodes.js';
import { getProtoMessages } from '../init/loadProtos.js';
import { CLIENT_VERSION } from '../constants/env.js';
import { HANDLER_IDS } from '../constants/handlerIds.js';
import { testLog } from '../utils/testLogger.js';
import { config } from '../config/config.js';

export const onData = (socket) => async (data) => {
  try {
    socket.buffer = Buffer.concat([socket.buffer, data]);
    console.log('=== 새로운 패킷 수신 ===');
    console.log('수신된 데이터:', data);

    // 패킷의 버전 길이까지의의 헤더 길이 (패킷 길이 정보 + 버전 길이 정보)
    const leastHeaderLength = config.packet.packetTypeLength + config.packet.versionLengthLength;
    let totalHeaderLength =
      config.packet.packetTypeLength +
      config.packet.versionLengthLength +
      config.packet.sequenceLength +
      config.packet.payloadLengthLength;
    let versionLength = 0;
    if (socket.buffer.length >= leastHeaderLength) {
      versionLength = socket.buffer.readUInt8(config.packet.packetTypeLength);
    }
    totalHeaderLength += versionLength;

    // 버퍼에 최소한 전체 헤더가 있을 때만 패킷을 처리
    while (socket.buffer.length >= totalHeaderLength) {
      let readHeadBuffer = 0;

      //패킷타입정보 수신(2바이트)
      const packetType = socket.buffer.readUInt16BE(readHeadBuffer);
      readHeadBuffer += config.packet.packetTypeLength + config.packet.versionLengthLength;

      //버전 수신
      const version = socket.buffer
        .slice(readHeadBuffer, readHeadBuffer + versionLength)
        .toString('utf-8');
      readHeadBuffer += versionLength;

      // clientVersion 검증
      if (version !== config.client.version) {
        throw new CustomError(
          ErrorCodes.CLIENT_VERSION_MISMATCH,
          '클라이언트 버전이 일치하지 않습니다.',
        );
      }
      // 시퀀스 수신(4바이트)
      const sequence = socket.buffer.readUInt32BE(readHeadBuffer);
      readHeadBuffer += config.packet.sequenceLength;

      // 패이로드 길이 수신(4바이트)
      const payloadLength = socket.buffer.readUInt32BE(readHeadBuffer);
      readHeadBuffer += config.packet.payloadLengthLength;

      //패이로드
      testLog(
        0,
        `[onData] packetType: ${packetType} / versionLength: ${versionLength} / \n
        version: ${version} / sequence: ${sequence} / payloadLength: ${payloadLength} /   `,
        'green',
      );

      // 3. 패킷 전체 길이 확인 후 데이터 수신
      if (socket.buffer.length >= payloadLength + readHeadBuffer) {
        // 패킷 데이터를 자르고 버퍼에서 제거
        const packet = socket.buffer.slice(readHeadBuffer, readHeadBuffer + payloadLength);
        socket.buffer = socket.buffer.slice(readHeadBuffer + payloadLength);

        try {
          const user = getUserBySocket(socket);
          let game;
          // 유저가 접속해 있는 상황에서 시퀀스 검증
          if (user && user.getNextSequence() !== sequence) {
            console.log(`USER SEQUENCE => ${user.sequence} / SEQUENCE => ${sequence}`);
            throw new CustomError(ErrorCodes.INVALID_SEQUENCE, '잘못된 호출 값입니다. ');
          }
          if(user !== undefined){
            game = getGameByUser(user);
          }

          testLog(0, `from ondata  packet: ${packet} `);
          const payload = packetParser(packetType, packet);
          const handler = getHandlerById(packetType);
          await handler({
            socket,
            userId: user !== undefined ? user.id : null,
            payload,
            user,
            game,
          });
        } catch (error) {
          handleError(socket, error);
        }
      }
    }
  } catch (error) {
    console.error('onData 처리 중 오류:', error);
    handleError(socket, error);
  }
};

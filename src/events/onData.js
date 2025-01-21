import { config } from '../config/config.js';
import { PACKET_TYPE } from '../constants/header.js';
import { packetParser } from '../utils/parser/packetParser.js';
import { getHandlerById } from '../handlers/index.js';
import { getGameByUser } from '../session/game.session.js';
import { getUserById, getUserBySocket } from '../session/user.session.js';
import { handleError } from '../utils/error/errorHandler.js';
import CustomError from '../utils/error/customError.js';
import { ErrorCodes } from '../utils/error/errorCodes.js';
import { getProtoMessages } from '../init/loadProtos.js';
import { CLIENT_VERSION } from '../constants/env.js';

export const onData = (socket) => async (data) => {
  // 기존 버퍼에 새로 수신된 데이터를 추가
  socket.buffer = Buffer.concat([socket.buffer, data]);

  // 패킷의 버전 길이까지의의 헤더 길이 (패킷 길이 정보 + 버전 길이이 정보)
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
    const packetType = socket.buffer.readUInt16(readHeadBuffer);
    readHeadBuffer += config.packet.packetTypeLength + config.packet.versionLengthLength;

    //버전 수신
    const version = socket.buffer.slice(readHeadBuffer, readHeadBuffer + versionLength).toString('utf-8');
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

    // 3. 패킷 전체 길이 확인 후 데이터 수신
    if (socket.buffer.length >= payloadLength + readHeadBuffer) {
      // 패킷 데이터를 자르고 버퍼에서 제거
      const packet = socket.buffer.slice(readHeadBuffer, readHeadBuffer + payloadLength);
      socket.buffer = socket.buffer.slice(readHeadBuffer + payloadLength);

      try {
        const user = getUserBySocket(socket);
        // 유저가 접속해 있는 상황에서 시퀀스 검증
        if (user && user.getNextSequence() !== sequence) {
          throw new CustomError(ErrorCodes.INVALID_SEQUENCE, '잘못된 호출 값입니다. ');
        }

        const game = getGameByUser(user);

        const payload = packetParser(packetType, packet);
        const handler = getHandlerById(packetType);
        await handler({
          socket,
          userId: user.id,
          payload,
          user,
        });
      } catch (error) {
        handleError(socket, error);
      }
    } else {
      // 아직 전체 패킷이 도착하지 않음
      break;
    }
  }
};

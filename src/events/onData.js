import { config } from '../config/config.js';
import { PACKET_TYPE } from '../constants/header.js';
import { packetParser } from '../utils/parser/packetParser.js';
import { getHandlerById } from '../handlers/index.js';
import { getUserById, getUserBySocket } from '../session/user.session.js';
import { handleError } from '../utils/error/errorHandler.js';
import CustomError from '../utils/error/customError.js';
import { ErrorCodes } from '../utils/error/errorCodes.js';
import { getProtoMessages } from '../init/loadProtos.js';
import { HANDLER_IDS } from '../constants/handlerIds.js';

export const onData = (socket) => async (data) => {
  try {
    socket.buffer = Buffer.concat([socket.buffer, data]);
    console.log("=== 새로운 패킷 수신 ===");
    console.log("수신된 데이터:", data);

    const headerSize = 12; // 2(size) + 6(version) + 4(handlerid)
    while (socket.buffer.length >= headerSize) {
      // 첫 2바이트는 패킷 타입
      const packetType = socket.buffer.readUInt16BE(0);
      // 그 다음 6바이트는 버전 (예: "1.0.0")
      const version = socket.buffer.toString('utf8', 2, 8);
      // 그 다음 4바이트는 핸들러 ID
      const handlerId = socket.buffer.readUInt32BE(8);
      // 마지막 4바이트는 페이로드 길이
      const payloadLength = socket.buffer.readUInt32BE(12);

      console.log("=== 패킷 정보 ===");
      console.log("패킷 타입:", packetType);
      console.log("클라이언트 버전:", version);
      console.log("핸들러 ID:", handlerId);
      console.log("페이로드 길이:", payloadLength);

      const totalLength = headerSize + 4 + payloadLength; // header + length field + payload

      if (socket.buffer.length >= totalLength) {
        const payload = socket.buffer.slice(16, totalLength);
        console.log("페이로드:", payload);

        try {
          const { handlerId, sequence, payload: parsedPayload, userId } = packetParser(payload);
          console.log("파싱된 페이로드:", { handlerId, sequence, payload: parsedPayload, userId });

          const handler = getHandlerById(handlerId);
          if (handler) {
            await handler({
              socket,
              userId,
              payload: parsedPayload,
            });
          }
        } catch (error) {
          console.error("패킷 처리 중 오류:", error);
          handleError(socket, error);
        }

        socket.buffer = socket.buffer.slice(totalLength);
      } else {
        break; // 더 많은 데이터를 기다림
      }
    }
  } catch (error) {
    console.error("onData 처리 중 오류:", error);
    handleError(socket, error);
  }
};
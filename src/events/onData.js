// onData.js
import { packetParser } from '../utils/parser/packetParser.js';
import { getHandlerById } from '../handlers/index.js';
import { handleError } from '../utils/error/errorHandler.js';

function hexDump(buffer, offset, length) {
  const bytes = [];
  for (let i = 0; i < length; i++) {
    bytes.push(buffer[offset + i].toString(16).padStart(2, '0'));
  }
  return bytes.join(' ');
}

// 4바이트를 빅엔디안 정수로 읽는 함수
function readInt32BE(buffer, offset) {
  return (buffer[offset] << 24) |
    (buffer[offset + 1] << 16) |
    (buffer[offset + 2] << 8) |
    buffer[offset + 3];
}

export const onData = (socket) => async (data) => {
  try {
    console.log("=== 새로운 데이터 수신 ===");
    console.log("Raw 데이터 길이:", data.length);
    console.log("Raw 데이터 (hex):", hexDump(data, 0, Math.min(data.length, 32)));

    // 버퍼에 새 데이터 추가
    socket.buffer = Buffer.concat([socket.buffer || Buffer.alloc(0), data]);

    while (socket.buffer.length >= 11) { // 최소 헤더 크기
      console.log("\n=== 새 패킷 파싱 시작 ===");
      console.log("버퍼 시작 부분 (hex):", hexDump(socket.buffer, 0, 16));

      // 1. 타입 (2바이트)
      // [00 01]을 1로 읽기 위해 두 번째 바이트 사용
      const type = socket.buffer[1];
      console.log(`패킷 타입: ${type} (bytes: ${hexDump(socket.buffer, 0, 2)})`);

      // 2. 버전 길이 (1바이트)
      const versionLength = socket.buffer[2];
      console.log(`버전 길이: ${versionLength} (byte: ${hexDump(socket.buffer, 2, 1)})`);

      const headerSize = 3 + versionLength;
      if (socket.buffer.length < headerSize + 8) {
        console.log("헤더 완성 대기 중...");
        break;
      }

      // 3. 버전 문자열
      const version = socket.buffer.slice(3, headerSize).toString('utf8');
      console.log(`버전: ${version} (bytes: ${hexDump(socket.buffer, 3, versionLength)})`);

      // 4. 시퀀스 (4바이트)
      const sequenceOffset = headerSize;
      const sequence = readInt32BE(socket.buffer, sequenceOffset);
      console.log(`시퀀스: ${sequence} (bytes: ${hexDump(socket.buffer, sequenceOffset, 4)})`);

      // 5. 페이로드 길이 (4바이트)
      const lengthOffset = headerSize + 4;
      const payloadLength = readInt32BE(socket.buffer, lengthOffset);
      console.log(`페이로드 길이: ${payloadLength} (bytes: ${hexDump(socket.buffer, lengthOffset, 4)})`);

      const totalLength = headerSize + 8 + payloadLength;
      console.log("예상되는 전체 패킷 길이:", totalLength);

      if (socket.buffer.length < totalLength) {
        console.log("전체 패킷 대기 중...");
        break;
      }

      // 페이로드 추출
      const payload = socket.buffer.slice(headerSize + 8, totalLength);
      console.log("페이로드 추출됨, 길이:", payload.length);
      console.log("페이로드 (hex):", hexDump(payload, 0, Math.min(payload.length, 32)));

      try {
        const parsedPacket = await packetParser({
          type,
          version,
          sequence,
          payload
        });
        console.log("파싱된 패킷:", parsedPacket);

        if (parsedPacket && parsedPacket.handlerId) {
          const handler = getHandlerById(parsedPacket.handlerId);
          if (handler) {
            await handler({
              socket,
              userId: parsedPacket.userId,
              payload: parsedPacket.payload,
            });
          }
        }
      } catch (error) {
        console.error("패킷 처리 중 오류:", error);
        handleError(socket, { ...error, requestType: 'register' });
      }

      // 처리된 데이터 제거
      socket.buffer = socket.buffer.slice(totalLength);
      console.log("남은 버퍼 크기:", socket.buffer.length);
    }
  } catch (error) {
    console.error("데이터 수신 처리 중 오류:", error);
    console.error(error.stack);
    handleError(socket, { ...error, requestType: 'register' });
  }
};
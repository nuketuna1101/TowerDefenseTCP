// utils/response/createResponse.js
import { getProtoMessages } from '../../init/loadProtos.js';

export const createResponse = (handlerId, responseCode, data = null, userId) => {
  console.log("=== 응답 생성 시작 ===");
  const protoMessages = getProtoMessages();

  // GamePacket 생성
  const GamePacket = protoMessages.test.GamePacket;
  let responseData;

  // 회원가입 응답의 경우
  if (handlerId === 1) { // REGISTER
    responseData = {
      registerResponse: {
        success: responseCode === 0,
        message: data.message,
        failCode: data.failCode || 0
      }
    };
  }

  console.log("생성할 응답:", responseData);
  const payloadBuffer = GamePacket.encode(GamePacket.create(responseData)).finish();
  console.log("페이로드 버퍼 길이:", payloadBuffer.length);

  // 버전 문자열 준비
  const version = "1.0.0";
  const versionBytes = Buffer.from(version, 'utf8');

  // 최종 버퍼 생성
  const headerLength = 11; // 타입(2) + 버전길이(1) + 시퀀스(4) + 페이로드길이(4)
  const totalLength = headerLength + versionBytes.length + payloadBuffer.length;
  const finalBuffer = Buffer.alloc(totalLength);
  let offset = 0;

  // 1. 패킷 타입 (2바이트)
  const typeBuffer = Buffer.alloc(2);
  // RegisterResponse = 2를 big endian으로 작성 (클라이언트가 reverse 할 것이므로)
  typeBuffer.writeInt16BE(2);
  typeBuffer.copy(finalBuffer, offset);
  offset += 2;

  // 2. 버전 길이 (1바이트)
  finalBuffer.writeUInt8(versionBytes.length, offset);
  offset += 1;

  // 3. 버전 문자열
  versionBytes.copy(finalBuffer, offset);
  offset += versionBytes.length;

  // 4. 시퀀스 (4바이트, little endian)
  const sequenceBuffer = Buffer.alloc(4);
  sequenceBuffer.writeInt32LE(0);
  sequenceBuffer.copy(finalBuffer, offset);
  offset += 4;

  // 5. 페이로드 길이 (4바이트, little endian)
  const lengthBuffer = Buffer.alloc(4);
  lengthBuffer.writeInt32LE(payloadBuffer.length);
  lengthBuffer.copy(finalBuffer, offset);
  offset += 4;

  // 6. 페이로드
  payloadBuffer.copy(finalBuffer, offset);

  console.log("=== 최종 패킷 구조 ===");
  console.log("총 길이:", totalLength);
  console.log("패킷 타입: RegisterResponse(2)");
  console.log("버전:", version);
  console.log("버전 길이:", versionBytes.length);
  console.log("시퀀스:", 0);
  console.log("페이로드 길이:", payloadBuffer.length);
  console.log("최종 버퍼:", finalBuffer);
  console.log("=== 응답 생성 완료 ===");

  return finalBuffer;
};
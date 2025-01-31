import { HANDLER_IDS } from '../../constants/handlerIds.js';
import { getProtoMessages } from '../../init/loadProtos.js';
import { testLog } from '../testLogger.js';

export const createResponse = (handlerId, responseCode, data = null, userId) => {
  console.log('=== 응답 생성 시작 ===');
  const protoMessages = getProtoMessages();
  // GamePacket 생성
  const GamePacket = protoMessages.test.GamePacket;

  let responseData;
  let responseType;

  switch (handlerId) {
    case HANDLER_IDS.REGISTER: // REGISTER
      responseData = {
        registerResponse: {
          success: responseCode === 0,
          message: data.message || '회원가입이 완료되었습니다.',
          failCode: data.failCode || 0,
        },
      };
      responseType = 2; // REGISTER_RESPONSE
      break;
    case HANDLER_IDS.LOGIN: // LOGIN
      responseData = {
        loginResponse: {
          success: responseCode === 0,
          message: data.message || '로그인이 완료되었습니다.',
          failCode: data.failCode || 0,
          token: data.token || null, // JWT 토큰 등
        },
      };
      responseType = 4; // LOGIN_RESPONSE (여기에 적절한 타입을 설정)
      break;
    // #region
    case HANDLER_IDS.PURCHASE_TOWER: // LOGIN
      testLog(0, `[data check] data.towerId: ${data.towerId} / is data null? ${(data == null)}`, 'red');
      if (responseCode !== 0){
        testLog(0, `[Error] purchase tower response not success`, 'red');
        return;
      }
      responseData = {
        towerPurchaseResponse: {
          towerId: data.towerId,
        },
      };
      responseType = 9;
      break;
    // #endregion
    // ... 기타 케이스들
  }

  const payloadBuffer = GamePacket.encode(GamePacket.create(responseData)).finish();

  const version = '1.0.0';
  const versionBytes = Buffer.from(version, 'utf8');

  const headerLength = 11;
  const totalLength = headerLength + versionBytes.length + payloadBuffer.length;
  const finalBuffer = Buffer.alloc(totalLength);
  let offset = 0;

  // 1. 타입 (2바이트) - 빅엔디안으로 변환
  const typeBuffer = Buffer.alloc(2);
  typeBuffer.writeInt16BE(responseType); // 빅엔디안으로 쓰기
  typeBuffer.copy(finalBuffer, offset);
  offset += 2;

  // 2. 버전 길이 (1바이트)
  finalBuffer.writeUInt8(versionBytes.length, offset);
  offset += 1;

  // 3. 버전 문자열
  versionBytes.copy(finalBuffer, offset);
  offset += versionBytes.length;

  // 4. 시퀀스 (4바이트) - 빅엔디안으로 변환
  const sequenceBuffer = Buffer.alloc(4);
  sequenceBuffer.writeInt32BE(0); // 빅엔디안으로 쓰기
  sequenceBuffer.copy(finalBuffer, offset);
  offset += 4;

  // 5. 페이로드 길이 (4바이트) - 빅엔디안으로 변환
  const lengthBuffer = Buffer.alloc(4);
  lengthBuffer.writeInt32BE(payloadBuffer.length); // 빅엔디안으로 쓰기
  lengthBuffer.copy(finalBuffer, offset);
  offset += 4;

  // 6. 페이로드
  payloadBuffer.copy(finalBuffer, offset);

  console.log(`Sending response with type: ${responseType}`);
  console.log('=== 응답 생성 완료 ===');
  return finalBuffer;
};

import { getProtoMessages } from '../../init/loadProtos.js';
import { getProtoTypeNameByHandlerId } from '../../handlers/index.js';
import CustomError from '../error/customError.js';
import { ErrorCodes } from '../error/errorCodes.js';
import { config } from '../../config/config.js';

export const packetParser = (handlerId, rawPayload) => {
  const protoMessages = getProtoMessages();

  // 핸들러 ID에 따라 적절한 payload 구조를 디코딩
  const protoTypeName = getProtoTypeNameByHandlerId(handlerId);
  if (!protoTypeName) {
    throw new CustomError(ErrorCodes.UNKNOWN_HANDLER_ID, `알 수 없는 핸들러 ID: ${handlerId}`);
  }

  const [namespace, typeName] = protoTypeName.split('.');
  const PayloadType = protoMessages[namespace][typeName];
  let payload;
  try {
    payload = PayloadType.decode(rawPayload);
  } catch (error) {
    throw new CustomError(ErrorCodes.PACKET_STRUCTURE_MISMATCH, '패킷 구조가 일치하지 않습니다.');
  }

  // 필드가 비어 있거나, 필수 필드가 누락된 경우 처리
  const expectedFields = Object.keys(PayloadType.fields);
  const actualFields = Object.keys(payload);
  const missingFields = expectedFields.filter((field) => !actualFields.includes(field));
  if (missingFields.length > 0) {
    throw new CustomError(
      ErrorCodes.MISSING_FIELDS,
      `필수 필드가 누락되었습니다: ${missingFields.join(', ')}`,
    );
  }

  return payload;
};
// 패이로드에 헤더를 붙여서 클라이언트에 보낼 패킷으로 변환환
export const payloadParser = (packetType, user, Payload) => {

  // 버전 문자열 준비
  const version = config.client.version;
  const versionBuffer = Buffer.from(version, 'utf8');
  
  // 1. 패킷 타입 정보를 포함한 버퍼 생성 (2바이트)
  const packetTypeBuffer = Buffer.alloc(config.packet.packetTypeLength);
  packetTypeBuffer.writeUInt8(packetType, 0);
  
  // 2. 버전 길이 (1바이트)
  const versionLengthBuffer = Buffer.alloc(config.packet.versionLengthLength);
  versionLengthBuffer.writeUInt8(versionBytes.length, 0);

  // 3. 버전 문자열
  //버전 길이를 위해 위로 올림

  // 4. 시퀀스 (4바이트, little endian)
  const sequenceBuffer = Buffer.alloc(config.packet.sequenceLength);
  sequenceBuffer.writeInt32LE(user.sequence);

  // 5. 페이로드 길이 (4바이트, little endian)
  const payloadLengthBuffer = Buffer.alloc(config.packet.payloadLengthLength);
  payloadLengthBuffer.writeInt32LE(Payload.length);

  // 6. 페이로드
  // 패러미터터
  
    // 길이 정보와 메시지를 함께 전송
    return Buffer.concat([packetTypeBuffer, versionLengthBuffer, versionBuffer, sequenceBuffer, payloadLengthBuffer, Payload]);
};

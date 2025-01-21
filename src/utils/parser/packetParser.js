import { getProtoMessages } from '../../init/loadProtos.js';
import { getProtoTypeNameByHandlerId } from '../../handlers/index.js';
import CustomError from '../error/customError.js';
import { ErrorCodes } from '../error/errorCodes.js';

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
// 클라이언트로 전달할 패킷으로 인코딩
export const payloadParser = (packetType, rawPayload) => {
    // 패킷 길이 정보를 포함한 버퍼 생성
    const packetLength = Buffer.alloc(config.packet.totalLength);
    packetLength.writeUInt32BE(
      message.length + config.packet.totalLength + config.packet.typeLength,
      0,
    );
  
    // 패킷 타입 정보를 포함한 버퍼 생성
    const packetType = Buffer.alloc(config.packet.typeLength);
    packetType.writeUInt8(type, 0);
  
    // 길이 정보와 메시지를 함께 전송
    return Buffer.concat([packetLength, packetType, message]);
};

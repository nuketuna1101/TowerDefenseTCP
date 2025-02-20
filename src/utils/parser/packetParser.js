// packetParser.js
import { getProtoMessages } from '../../init/loadProtos.js';
import { getProtoTypeNameByHandlerId } from '../../handlers/index.js';
import CustomError from '../error/customError.js';
import { ErrorCodes } from '../error/errorCodes.js';
import { config } from '../../config/config.js';
import { testLog } from '../testLogger.js';

export const packetParser = (handlerId, rawPayload) => {
  const protoMessages = getProtoMessages();
  // 핸들러 ID에 따라 적절한 payload 구조를 디코딩
  const protoTypeName = getProtoTypeNameByHandlerId(handlerId);
  if (!protoTypeName) {
    throw new CustomError(ErrorCodes.UNKNOWN_HANDLER_ID, `알 수 없는 핸들러 ID: ${handlerId}`);
  }

  const [namespace, typeName] = protoTypeName.split('.');
  const expectedPayloadType = protoMessages[namespace][typeName];
  const PayloadType = protoMessages['test']['GamePacket'];
  testLog(0,`expectedPayloadType: ${expectedPayloadType}`,'green',);


  let payload;
  try {
    payload = PayloadType.decode(rawPayload);
    testLog(
      0,
      `Namespace: ${protoMessages['test']['C2SRegisterRequest']} \n 
      protoTypeName: ${protoTypeName}\n
      handlerId: ${handlerId}\n
      namespace: ${namespace} / typeName: ${typeName}\n`,
      'yellow'
    );
    testLog(
      0,
      `PayloadType: ${PayloadType} /  ${JSON.stringify(PayloadType)} / rawPayload: ${rawPayload}\n`,
      'yellow', 
      false
    );
  } catch (error) {
    throw new CustomError(ErrorCodes.PACKET_STRUCTURE_MISMATCH, '패킷 구조가 일치하지 않습니다.');
  }

  // 필드가 비어 있거나, 필수 필드가 누락된 경우 처리
  const expectedFields = Object.keys(expectedPayloadType.fields);

  testLog(0,`expectedFields: ${expectedFields}`,'red');
  testLog(0,`payload: ${JSON.stringify(payload)}`,'blue');

  const actualFields = Object.keys(Object.values(payload)[0]);
  testLog(0,`actualFields: ${actualFields}`,'green');

  const missingFields = expectedFields.filter((field) => !actualFields.includes(field));
  testLog(0, `missingFields: ${missingFields} / length: ${missingFields.length}`);
  if (missingFields.length > 0) {
    throw new CustomError(ErrorCodes.INVALID_PACKET, '지원하지 않는 패킷 타입입니다.');
  }
  let returnPayload = {};
  for (const [key, value] of Object.entries(Object.values(payload)[0])) {
    returnPayload[key] = value;
  }
  console.log(returnPayload);
  return returnPayload;
};

// 패이로드에 헤더를 붙여서 클라이언트에 보낼 패킷으로 변환
export const payloadParser = (packetType, user, Payload) => {
  // 버전 문자열 준비
  const version = config.client.version;
  const versionBuffer = Buffer.from(version, 'utf8');

  // 1. 패킷 타입 정보를 포함한 버퍼 생성 (2바이트)
  const packetTypeBuffer = Buffer.alloc(config.packet.packetTypeLength);
  packetTypeBuffer.writeUint16BE(packetType, 0);

  // 2. 버전 길이 (1바이트)
  const versionLengthBuffer = Buffer.alloc(config.packet.versionLengthLength);
  versionLengthBuffer.writeUInt8(versionBuffer.length, 0);

  // 3. 시퀀스 (4바이트, big endian)
  const sequenceBuffer = Buffer.alloc(config.packet.sequenceLength);
  sequenceBuffer.writeInt32BE(user.sequence);

  // 4. 페이로드 길이 (4바이트, big endian)
  const payloadLengthBuffer = Buffer.alloc(config.packet.payloadLengthLength);
  payloadLengthBuffer.writeInt32BE(Payload.length);

  // 5. 최종 패킷 데이터 생성
  return Buffer.concat([
    packetTypeBuffer,
    versionLengthBuffer,
    versionBuffer,
    sequenceBuffer,
    payloadLengthBuffer,
    Payload,
  ]);
};
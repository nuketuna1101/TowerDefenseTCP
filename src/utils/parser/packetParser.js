// packetParser.js
import { getProtoMessages } from '../../init/loadProtos.js';
import CustomError from '../error/customError.js';
import { ErrorCodes } from '../error/errorCodes.js';

export const packetParser = async (packetInfo) => {
  try {
    console.log("=== 패킷 파서 시작 ===");
    console.log("입력 패킷 정보:", {
      type: packetInfo.type,
      version: packetInfo.version,
      sequence: packetInfo.sequence,
      payloadLength: packetInfo.payload.length
    });

    const protoMessages = getProtoMessages();
    const GamePacket = protoMessages.test.GamePacket;

    if (!GamePacket) {
      throw new CustomError(ErrorCodes.INVALID_PACKET, 'GamePacket 프로토 정의를 찾을 수 없습니다.');
    }

    // payload를 GamePacket으로 디코딩
    const decoded = GamePacket.decode(packetInfo.payload);
    console.log("디코딩된 GamePacket:", decoded);

    // 패킷 타입에 따라 처리
    switch (packetInfo.type) {
      case 1: // REGISTER_REQUEST
        if (!decoded.registerRequest) {
          throw new CustomError(ErrorCodes.INVALID_PACKET, 'RegisterRequest 데이터가 없습니다.');
        }
        return {
          handlerId: 1,
          sequence: packetInfo.sequence,
          userId: null,
          payload: {
            id: decoded.registerRequest.id,
            password: decoded.registerRequest.password,
            email: decoded.registerRequest.email
          }
        };

      case 3: // LOGIN_REQUEST
        if (!decoded.loginRequest) {
          throw new CustomError(ErrorCodes.INVALID_PACKET, 'LoginRequest 데이터가 없습니다.');
        }
        return {
          handlerId: 2,
          sequence: packetInfo.sequence,
          userId: null,
          payload: {
            id: decoded.loginRequest.id,
            password: decoded.loginRequest.password
          }
        };

      default:
        throw new CustomError(
          ErrorCodes.INVALID_PACKET,
          `지원하지 않는 패킷 타입입니다: ${packetInfo.type}`
        );
    }
  } catch (error) {
    console.error("패킷 파싱 오류:", error);
    throw error instanceof CustomError ? error : new CustomError(
      ErrorCodes.PACKET_DECODE_ERROR,
      '패킷 디코딩 중 오류가 발생했습니다: ' + error.message
    );
  }
};
import { getProtoMessages } from '../../init/loadProtos.js';
import CustomError from '../error/customError.js';
import { ErrorCodes } from '../error/errorCodes.js';

export const packetParser = (data) => {
  try {
    const protoMessages = getProtoMessages();
    console.log("=== 패킷 파싱 시작 ===");

    // GamePacket으로 디코딩
    const GamePacket = protoMessages.test.GamePacket;
    console.log("GamePacket 타입:", GamePacket);

    const packet = GamePacket.decode(data);
    console.log("디코딩된 GamePacket:", packet);

    // 페이로드 타입 확인
    console.log("PayloadCase:", packet.payloadCase);

    // registerRequest가 있는 경우
    if (packet.registerRequest) {
      const registerRequest = packet.registerRequest;
      console.log("Register Request:", registerRequest);

      return {
        handlerId: 1, // REGISTER
        sequence: 0,
        userId: null,
        payload: {
          id: registerRequest.id,
          password: registerRequest.password,
          email: registerRequest.email
        }
      };
    }

    // loginRequest가 있는 경우
    if (packet.loginRequest) {
      const loginRequest = packet.loginRequest;
      console.log("Login Request:", loginRequest);

      return {
        handlerId: 2, // LOGIN
        sequence: 0,
        userId: null,
        payload: {
          id: loginRequest.id,
          password: loginRequest.password
        }
      };
    }

    throw new CustomError(
      ErrorCodes.INVALID_PACKET,
      '지원하지 않는 패킷 타입입니다.'
    );

  } catch (error) {
    console.error("패킷 파싱 오류:", error);
    throw new CustomError(
      ErrorCodes.PACKET_DECODE_ERROR,
      '패킷 디코딩 중 오류가 발생했습니다.'
    );
  }
};
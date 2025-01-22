import { loadProtos, getProtoMessages } from "./src/init/loadProtos.js"
import net from 'node:net';
import {config} from './src/config/config.js'

const payloadParser = (Payload, packetType= 1) => {

    // 버전 문자열 준비
    const version = config.client.version;
    const versionBuffer = Buffer.from(version, 'utf8');

    // 1. 패킷 타입 정보를 포함한 버퍼 생성 (2바이트)
    const packetTypeBuffer = Buffer.alloc(config.packet.packetTypeLength);
    packetTypeBuffer.writeUInt8(packetType, 0);

    // 2. 버전 길이 (1바이트)
    const versionLengthBuffer = Buffer.alloc(config.packet.versionLengthLength);
    versionLengthBuffer.writeUInt8(versionBuffer.length, 0);

    // 3. 버전 문자열
    //버전 길이를 위해 위로 올림

    // 4. 시퀀스 (4바이트, little endian)
    const sequenceBuffer = Buffer.alloc(config.packet.sequenceLength);
    sequenceBuffer.writeInt32LE(1);

    // 5. 페이로드 길이 (4바이트, little endian)
    const payloadLengthBuffer = Buffer.alloc(config.packet.payloadLengthLength);
    payloadLengthBuffer.writeInt32LE(Payload.length);

    // 6. 페이로드
    // 패러미터터

    // 길이 정보와 메시지를 함께 전송
    return Buffer.concat([packetTypeBuffer, versionLengthBuffer, versionBuffer, sequenceBuffer, payloadLengthBuffer, Payload]);
};

const sendPacketC2S = () => {
    const protoMessages = getProtoMessages();
    console.log("protoMessages: " + JSON.stringify(protoMessages));
    const C2Sregreq = protoMessages['test']['C2SRegisterRequest'];
    const buffer = C2Sregreq.create({
        id: 'tester',
        email: 'email@gmail.com',
        password: '1234abcd'
    });
    const encoded = C2Sregreq.encode(buffer).finish();
    const res = payloadParser(encoded);
    const socket = new net.Socket();
    socket.connect(5555, 'localhost', () => {
        console.log("connect to server");
        socket.write(res);
    });
};

async function main() {
    await loadProtos();
    sendPacketC2S();
};




main();
// loadProtos();
// sendPacketC2S();
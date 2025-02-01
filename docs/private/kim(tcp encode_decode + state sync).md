 # 패킷 분해/헤더 및 상태 동기화 

## 패킷 분해/헤더

| **필드 명** | **타입** | **설명** |
| --- | --- | --- |
| packetType | ushort | 패킷 타입 (2바이트) |
| versionLength | ubyte | 버전 길이 (1바이트) |
| version | string | 버전 (문자열) |
| sequence | uint32 | 패킷 번호 (4바이트) |
| payloadLength | uint32 | 데이터 길이 (4바이트) |
| payload | bytes | 실제 데이터 |

### 받는 경우 
- on data 이벤트에서 변환하는 내용을 만들었다.

```
  export const onData = (socket) => async (data) => {
    try {
      socket.buffer = Buffer.concat([socket.buffer, data]);
      console.log('=== 새로운 패킷 수신 ===');
      console.log('수신된 데이터:', data);

      // 패킷의 버전 길이까지의의 헤더 길이 (패킷 길이 정보 + 버전 길이 정보)
      const leastHeaderLength = config.packet.packetTypeLength + config.packet.versionLengthLength;
      let totalHeaderLength =
        config.packet.packetTypeLength +
        config.packet.versionLengthLength +
        config.packet.sequenceLength +
        config.packet.payloadLengthLength;
      let versionLength = 0;
      if (socket.buffer.length >= leastHeaderLength) {
        versionLength = socket.buffer.readUInt8(config.packet.packetTypeLength);
      }
      totalHeaderLength += versionLength;

      // 버퍼에 최소한 전체 헤더가 있을 때만 패킷을 처리
      while (socket.buffer.length >= totalHeaderLength) {
        let readHeadBuffer = 0;

        //패킷타입정보 수신(2바이트)
        const packetType = socket.buffer.readUInt16BE(readHeadBuffer);
        readHeadBuffer += config.packet.packetTypeLength + config.packet.versionLengthLength;

        //버전 수신
        const version = socket.buffer
          .slice(readHeadBuffer, readHeadBuffer + versionLength)
          .toString('utf-8');
        readHeadBuffer += versionLength;

        // clientVersion 검증
        if (version !== config.client.version) {
          throw new CustomError(
            ErrorCodes.CLIENT_VERSION_MISMATCH,
            '클라이언트 버전이 일치하지 않습니다.',
          );
        }
        // 시퀀스 수신(4바이트)
        const sequence = socket.buffer.readUInt32BE(readHeadBuffer);
        readHeadBuffer += config.packet.sequenceLength;

        // 패이로드 길이 수신(4바이트)
        const payloadLength = socket.buffer.readUInt32BE(readHeadBuffer);
        readHeadBuffer += config.packet.payloadLengthLength;

        // 3. 패킷 전체 길이 확인 후 데이터 수신
        if (socket.buffer.length >= payloadLength + readHeadBuffer) {
          // 패킷 데이터를 자르고 버퍼에서 제거
          const packet = socket.buffer.slice(readHeadBuffer, readHeadBuffer + payloadLength);
          socket.buffer = socket.buffer.slice(readHeadBuffer + payloadLength);

          try {
            const user = getUserBySocket(socket);
            let game;
            // 유저가 접속해 있는 상황에서 시퀀스 검증
            if (user && user.getNextSequence() !== sequence) {
              console.log(`USER SEQUENCE => ${user.sequence} / SEQUENCE => ${sequence}`);
              throw new CustomError(ErrorCodes.INVALID_SEQUENCE, '잘못된 호출 값입니다. ');
            }
            if(user !== undefined){
              game = getGameByUser(user);
            }

            const payload = packetParser(packetType, packet);
            const handler = getHandlerById(packetType);
            await handler({
              socket,
              userId: user !== undefined ? user.id : null,
              payload,
              user,
              game,
            });
          } catch (error) {
            handleError(socket, error);
          }
        }
      }
    } catch (error) {
      console.error('onData 처리 중 오류:', error);
      handleError(socket, error);
    }
  };
```
헤더 부분을 때어내서 해석을 하는 내용이다.
버전 길이가 따로 클라이언트에서 보내주기 때문에 헤더의 길이를 유동적으로 처리한다.
- packetParser 데이터 디코딩(handlerId == packetType )
handlerId 를 protoType과 같은 의미로 사용했다.
```
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
  testLog(0, `protoTypeName: ${protoTypeName}`, 'yellow');
  testLog(0, `namespace: ${namespace}, typeName: ${typeName}`, 'green');
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
```
프로토 버퍼에 oneof 로 해서 알아서 패킷을 찾아서 분해한다. 처음에 이걸 이해 못해서 꽤 고생했다.
### 주는 경우 (헤더 추가)
- payloadParser 함수로 전해받은 내용을 합치는 내용이다.
```
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
```
사실상 상수값을 순서대로 붙여서 보냈다.



### 상태 동기화
프로토 버퍼 : S2CStateSyncNotification stateSyncNotification = 7;

stateSyncNotificationHandler 헨들러로 처리
- 패이로드 생성
```
export const createS2CStateSyncNotificationPacket = (user) => {
  const protoMessages = getProtoMessages();
  const userStateData = protoMessages.test.GamePacket;
  const userTowers = user.towers.map((value) => {
    return { towerId: value.id, x: value.x, y: value.y };
  });
  const userMonsters = user.monsters.map((value) => {
    return { monsterId: value.id, monsterNumber: value.num, level: value.level };
  });

  const payload = {
    stateSyncNotification: {
      userGold: user.gold,
      baseHp: user.baseHp,
      monsterLevel: user.monsterLevel,
      score: user.score,
      towers: userTowers,
      monsters: userMonsters,
    },
  };
  const message = userStateData.create(payload);
  const userStateDataPacket = userStateData.encode(message).finish();
  return payloadParser(PACKET_TYPE.STATE_SYNC_NOTIFICATION, user, userStateDataPacket);
};
```
유저 정보를 패이로드에 담아 보내는 내용이다.

### 기지 HP 업데이트 및 게임 오버
C2SMonsterAttackBaseRequest monsterAttackBaseRequest = 16;
- 몬스터 공격 처리 헨들러 
```
const monsterAttackBaseRequestHandler = ({socket, userId, payload, user, game}) => {
  try {
    const {damage} = payload;

    user.substractBaseHp(damage);
  } catch (error) {
    handleError(user.socket, error);
  }
};
```
유저 클래스에서 기지 체력을 감소시킨다. -> 유저 기지 체력 변경으로 updateBaseHpNotification 호출

S2CUpdateBaseHPNotification updateBaseHpNotification = 17;
- 기지 체력 업데이트 
```
const updateBaseHpNotificationHandler = ({ user }) => {
  try {
    const gameSession = getGameByUser(user);
    if (gameSession) {
      const users = gameSession.users;
      users[0].socket.write(
        createS2CUpdateBaseHPNotificationPacket(user, users[1].id === user.id),
      );
      users[1].socket.write(
        createS2CUpdateBaseHPNotificationPacket(user, users[0].id === user.id),
      );
    }
  } catch (error) {
    handleError(user.socket, error);
  }
};
```
두 유저에게 현재 체력을 전달한다.
```
export const createS2CUpdateBaseHPNotificationPacket = (user, isOpponent = true) => {
  const protoMessages = getProtoMessages();
  const baseHpData = protoMessages.test.GamePacket;

  testLog(0, `userid ${user.id} userhp ${user.baseHp} isOpponent ${isOpponent}`);
  const payload = {
    updateBaseHpNotification: {
      isOpponent,
      baseHp: user.baseHp,
    },
  };
  const message = baseHpData.create(payload);
  const baseHpDataPacket = baseHpData.encode(message).finish();
  testLog(0, `baseHpDataPacket ${baseHpDataPacket.toString('hex')}`);
  return payloadParser(PACKET_TYPE.UPDATE_BASE_HP_NOTIFICATION, user, baseHpDataPacket);
};
```
패킷 생성 함수

S2CGameOverNotification gameOverNotification = 18;
- 게임 종료 
```
  substractBaseHp(baseHp) {
    if (this.baseHp <= baseHp) {
      const handler = getHandlerById(18);
      handler({
        user: this,
      });

      return -1;
    }
    this.baseHp -= baseHp;
    updateBaseHp(this);

    return this.baseHp;
  }

  setDatabaseId(databaseId) {
    return (this.databaseId = databaseId);
  }
```
기지 체력이 0 혹은 그 이하가 된 사용자가 호출한다.
```
const updategameOverNotificationHandler = ({ user }) => {
  try {
    const gameSession = getGameByUser(user);
    const users = gameSession.users;

    users[0].socket.write(createS2CGameOverNotificationPacket(users[0], users[0].id !== user.id));
    users[1].socket.write(createS2CGameOverNotificationPacket(users[1], users[0].id === user.id));

    removeGameSession(gameSession.id);
  } catch (error) {
    handleError(user.socket, error);
  }
};
```
각 유저에게 내용에 맞게 전송 
```
export const createS2CGameOverNotificationPacket = (user, isWin) => {
  const protoMessages = getProtoMessages();
  const gameOverData = protoMessages.test.GamePacket;

  const payload = {
    gameOverNotification: {
      isWin,
    },
  };
  const message = gameOverData.create(payload);
  const gameOverDataPacket = gameOverData.encode(message).finish();
  return payloadParser(PACKET_TYPE.GAME_OVER_NOTIFICATION, user, gameOverDataPacket);
};
```
패킷 생성 함수 

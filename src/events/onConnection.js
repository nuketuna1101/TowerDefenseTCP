//onConnection.js
import { onEnd } from './onEnd.js';
import { onError } from './onError.js';
import { onData } from './onData.js';
import { addUser } from '../session/user.session.js';

export const onConnection = (socket) => {
  console.log('클라이언트가 연결되었습니다:', socket.remoteAddress, socket.remotePort);

  // 소켓 객체에 buffer 속성을 추가하여 각 클라이언트에 고유한 버퍼를 유지
  socket.buffer = Buffer.alloc(0);
  // 시퀀스 문제 해결 방안
  addUser(socket.id, socket);

  socket.on('data', onData(socket));
  socket.on('end', onEnd(socket));
  socket.on('error', onError(socket));
};

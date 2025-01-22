import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import protobuf from 'protobufjs';
import { packetNames } from '../protobuf/packetNames.js';

// 현재 파일의 절대 경로 추출
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 프로토파일이 있는 디렉토리 경로 설정
const protoDir = path.join(__dirname, '../protobuf');

// 주어진 디렉토리 내 모든 proto 파일을 재귀적으로 찾는 함수
const getAllProtoFiles = (dir, fileList = []) => {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getAllProtoFiles(filePath, fileList);
    } else if (path.extname(file) === '.proto') {
      fileList.push(filePath);
    }
  });
  return fileList;
};

// 모든 proto 파일 경로를 가져옴
const protoFiles = getAllProtoFiles(protoDir);

// 로드된 프로토 메시지들을 저장할 객체
const protoMessages = {};

// 모든 .proto 파일을 로드하여 프로토 메시지를 초기화합니다.
export const loadProtos = async () => {
  try {
    const root = new protobuf.Root();

    const protoFiles = getAllProtoFiles(protoDir);
    console.log('Found proto files:', protoFiles);

    for (const file of protoFiles) {
      console.log('Loading proto file:', file);
      await root.load(file);
    }

    // 로드된 타입들 출력
    console.log('Loaded types in root:',
      Object.keys(root.nested || {}).map(ns => ({
        namespace: ns,
        types: root.nested[ns] ? Object.keys(root.nested[ns].nested || {}) : []
      }))
    );

    // packetNames에 정의된 패킷들을 등록
    for (const [namespace, types] of Object.entries(packetNames)) {
      protoMessages[namespace] = {};
      for (const [type, typeName] of Object.entries(types)) {
        try {
          console.log(`Looking up type: ${typeName}`);
          const resolvedType = root.lookupType(typeName);
          console.log(`Successfully resolved type: ${typeName}`);
          protoMessages[namespace][type] = resolvedType;
        } catch (error) {
          console.error(`Failed to load type ${typeName}:`, error);
          throw error;
        }
      }
    }

    console.log('Final protoMessages object:',
      Object.keys(protoMessages).reduce((acc, ns) => {
        acc[ns] = Object.keys(protoMessages[ns]);
        return acc;
      }, {})
    );
  } catch (error) {
    console.error('Error loading protos:', error);
    throw error;
  }
};

// 깊은 복사 (완전한 복사)
// 얕은 복사
export const getProtoMessages = () => {
  return { ...protoMessages };
};

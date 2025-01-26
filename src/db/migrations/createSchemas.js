// createSchemas.js
import path from 'path';
import mysql from 'mysql2/promise';
import { config } from '../../config/config.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createDatabase = async () => {
  try {
    // MySQL 연결 생성
    const connection = await mysql.createConnection({
      host: config.databases.USER_DB.host,
      user: config.databases.USER_DB.user,
      password: config.databases.USER_DB.password,
      multipleStatements: true  // 여러 쿼리를 한 번에 실행하기 위해 필요
    });

    // 데이터베이스 생성
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${config.databases.USER_DB.name}`);
    console.log(`Database ${config.databases.USER_DB.name} created or already exists.`);

    // 데이터베이스 선택
    await connection.query(`USE ${config.databases.USER_DB.name}`);

    // 모든 테이블 삭제를 하나의 쿼리로 실행
    console.log('Dropping existing tables...');
    await connection.query(`
      DROP TABLE IF EXISTS MatchHistoryTable;
      DROP TABLE IF EXISTS userScore;
      DROP TABLE IF EXISTS userTable;
    `);

    // 테이블 생성
    console.log('Creating new tables...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS userTable (
        id            INT PRIMARY KEY AUTO_INCREMENT,
        username      VARCHAR(255) UNIQUE NOT NULL,
        email         VARCHAR(255) UNIQUE NOT NULL,
        password      VARCHAR(255) NOT NULL,
        createAt      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        lastLoginTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS userScore (
        userId    INT PRIMARY KEY,
        highScore INT DEFAULT 0,
        FOREIGN KEY (userId) REFERENCES userTable (id)
      );

      CREATE TABLE IF NOT EXISTS MatchHistoryTable (
        id           INT PRIMARY KEY AUTO_INCREMENT,
        player1      INT NOT NULL,
        player2      INT NOT NULL,
        winPlayer    INT NOT NULL,
        player1Score INT DEFAULT 0,
        player2Score INT DEFAULT 0,
        timestamp    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (player1) REFERENCES userTable (id),
        FOREIGN KEY (player2) REFERENCES userTable (id),
        FOREIGN KEY (winPlayer) REFERENCES userTable (id)
      );
    `);

    console.log('Database tables created successfully');
    await connection.end();
  } catch (error) {
    console.error('Error creating database:', error);
    throw error;
  }
};

createDatabase()
  .then(() => {
    console.log('Database setup completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Database setup failed:', error);
    process.exit(1);
  });
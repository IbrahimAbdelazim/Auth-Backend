/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import * as dotenv from 'dotenv';
import * as dotenvExpand from 'dotenv-expand';
import { Connection } from 'mongoose';
import { getConnectionToken } from '@nestjs/mongoose';
import { App } from 'supertest/types';

jest.setTimeout(30000);
const env = dotenv.config({ path: '.env.test', override: true });
dotenvExpand.expand(env);

describe('App (e2e)', () => {
  let app: INestApplication;
  let connection: Connection;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    connection = moduleFixture.get<Connection>(getConnectionToken());
  });

  afterAll(async () => {
    if (connection.readyState !== 1) {
      console.warn('⚠️ MongoDB is not connected. Skipping dropDatabase.');
    } else {
      await connection.dropDatabase();
    }

    await app.close();
  });

  it('/api/v1/auth/sign-up (POST) - should create user', async () => {
    const res = await request(app.getHttpServer() as App)
      .post('/auth/sign-up')
      .send({
        email: 'e2e@test.com',
        name: 'e2e user',
        password: 'E2e@1234',
      });

    expect(res.status).toBe(201);
  });

  it('/api/v1/auth/sign-in (POST) - should return JWT token', async () => {
    const res = await request(app.getHttpServer() as App)
      .post('/auth/sign-in')
      .send({
        email: 'e2e@test.com',
        password: 'E2e@1234',
      });

    expect(res.status).toBe(201);
    expect(res.body.access_token).toBeDefined();
  });

  it('/api/v1/user/me (GET) - should return current user with token', async () => {
    const login = await request(app.getHttpServer() as App)
      .post('/auth/sign-in')
      .send({
        email: 'e2e@test.com',
        password: 'E2e@1234',
      });

    const token = login.body.access_token;

    const res = await request(app.getHttpServer() as App)
      .get('/user/me')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.email).toBe('e2e@test.com');
  });
});

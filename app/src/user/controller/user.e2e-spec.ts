import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UserController } from './user.controller';
import { UserService } from '../service';
import { mockAuth } from '../../auth/auth.mock';

const findOne = jest.fn();
const remove = jest.fn();

const baseUrl = '/api/user';

describe(`UserController (e2e) ${baseUrl}`, () => {
  const userId = 1;
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await mockAuth(
      { id: userId },
      Test.createTestingModule({
        providers: [
          {
            provide: UserService,
            useValue: { findOne, remove },
          },
        ],
        controllers: [UserController],
      }),
    ).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(() => {
    findOne.mockReset();
    remove.mockReset();
  });

  describe('GET /', () => {
    it('should return client user', () => {
      const user = { login: 'l' };
      findOne.mockReturnValueOnce(user);

      return request(app.getHttpServer()).get(baseUrl).expect(200).expect(user);
    });
  });

  describe('DELETE /', () => {
    it('should delete user', () => {
      return request(app.getHttpServer()).delete(baseUrl).expect(200);
    });
  });
});

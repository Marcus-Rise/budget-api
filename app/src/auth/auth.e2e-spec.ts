import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthLocalStrategy } from './strategy/auth-local.strategy';

const registerUser = jest.fn();
const validateUser = jest.fn();
const generateToken = jest.fn();

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        AuthLocalStrategy,
        {
          provide: AuthService,
          useValue: { registerUser, validateUser, generateToken },
        },
      ],
      controllers: [AuthController],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(new ValidationPipe());

    await app.init();
  });

  describe('login', () => {
    const loginUrl = '/api/auth/login';

    it('should accept valid dto', () => {
      const dto = { login: 'login', password: 'password' };

      validateUser.mockReturnValueOnce(dto);

      const token = { access_token: 'token' };
      generateToken.mockReturnValueOnce(token);

      return request(app.getHttpServer()).post(loginUrl).send(dto).expect(200).expect(token);
    });

    it('should return 401 on empty dto', () => {
      const dto = { login: '', password: '' };

      return request(app.getHttpServer()).post(loginUrl).send(dto).expect(401);
    });
  });

  describe('register', () => {
    const registerUrl = '/api/auth/register';

    it('should accept valid dto', async () => {
      const dto = { login: 'login', password: 'password' };

      await request(app.getHttpServer())
        .post(registerUrl)
        .send(dto)
        .expect(201)
        .expect({ status: 'ok' });

      expect(registerUser).toHaveBeenNthCalledWith(1, dto);
    });

    it('should return 400 on empty dto', () => {
      const dto = { login: '', password: '' };

      return request(app.getHttpServer()).post(registerUrl).send(dto).expect(400);
    });

    it('should return 400 on wrong dto', () => {
      const dto = { login: 'll', password: 'pp' };

      return request(app.getHttpServer()).post(registerUrl).send(dto).expect(400);
    });
  });
});

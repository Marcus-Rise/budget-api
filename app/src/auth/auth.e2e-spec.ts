import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthLocalStrategy } from './strategy/auth-local.strategy';
import { JwtConfig } from './config/jwt.config';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthJwtStrategy } from './strategy/auth-jwt.strategy';

const registerUser = jest.fn();
const validateUser = jest.fn();
const generateToken = jest.fn();
const generateRefreshToken = jest.fn();
const generateAccessTokenFromRefreshToken = jest.fn();

const jwtConfig: JwtConfig = {
  secret: 'secret',
};

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        AuthLocalStrategy,
        {
          provide: ConfigService,
          useValue: {
            get: () => jwtConfig,
          },
        },
        JwtService,
        AuthJwtStrategy,
        {
          provide: AuthService,
          useValue: {
            registerUser,
            validateUser,
            generateToken,
            generateRefreshToken,
            generateAccessTokenFromRefreshToken,
          },
        },
      ],
      controllers: [AuthController],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(new ValidationPipe({ transform: true }));

    await app.init();
  });

  describe('login', () => {
    const loginUrl = '/api/auth/login';

    it('should accept valid dto', () => {
      const dto = { login: 'login', password: 'password' };

      validateUser.mockReturnValueOnce(dto);

      const token = 'token';
      const refreshToken = 'refresh-token';
      generateToken.mockReturnValueOnce(token);
      generateRefreshToken.mockReturnValueOnce(refreshToken);

      return request(app.getHttpServer())
        .post(loginUrl)
        .send(dto)
        .expect(200)
        .expect({ type: 'bearer', access_token: token, refresh_token: refreshToken });
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

  describe('refresh', () => {
    const refreshUrl = '/api/auth/refresh';

    it('should refresh token', async () => {
      const user = {
        isActive: false,
        login: 'login',
        id: 1,
      };
      const jwtService = app.get(JwtService);
      const token = jwtService.sign(user, { secret: jwtConfig.secret });

      const generatedAccessToken = 'access_token';
      generateAccessTokenFromRefreshToken.mockReturnValueOnce(generatedAccessToken);

      const refreshToken = 'refresh_token';

      await request(app.getHttpServer())
        .post(refreshUrl)
        .send({ refresh_token: refreshToken })
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect({ type: 'bearer', access_token: generatedAccessToken })
        .expect(() => {
          expect(generateAccessTokenFromRefreshToken).toHaveBeenNthCalledWith(1, refreshToken);
        });
    });

    it('should reject wrong dto', async () => {
      const user = {
        isActive: false,
        login: 'login',
        id: 1,
      };
      const jwtService = app.get(JwtService);
      const token = jwtService.sign(user, { secret: jwtConfig.secret });

      const generatedAccessToken = 'access_token';
      generateAccessTokenFromRefreshToken.mockReturnValueOnce(generatedAccessToken);

      const refreshToken = '';

      return request(app.getHttpServer())
        .post(refreshUrl)
        .send({ refresh_token: refreshToken })
        .set('Authorization', `Bearer ${token}`)
        .expect(400);
    });
  });
});

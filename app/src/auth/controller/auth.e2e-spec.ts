import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AuthController } from './auth.controller';
import { AuthService } from '../service';
import { AuthLocalStrategy } from '../strategy/auth-local.strategy';
import { JwtConfig } from '../config/jwt.config';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthJwtStrategy } from '../strategy/auth-jwt.strategy';
import { AuthJwtPermissions, IAuthJwtPayload } from '../types';

const registerUser = jest.fn();
const validateUser = jest.fn();
const generateToken = jest.fn();
const generateRefreshToken = jest.fn();
const generateAccessTokenFromRefreshToken = jest.fn();
const activateUser = jest.fn();
const resetPassword = jest.fn();

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
            activateUser,
            resetPassword,
          },
        },
      ],
      controllers: [AuthController],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(new ValidationPipe({ transform: true }));

    await app.init();
  });

  afterEach(() => {
    registerUser.mockReset();
    validateUser.mockReset();
    generateToken.mockReset();
    generateRefreshToken.mockReset();
    generateAccessTokenFromRefreshToken.mockReset();
    activateUser.mockReset();
    resetPassword.mockReset();
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
      const dto = { login: 'login@login.com', password: 'password' };

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

  describe('resetPassword', () => {
    const url = '/api/auth/reset-password';

    it('should accept valid dto', async () => {
      const dto = { login: 'login@login.com' };

      await request(app.getHttpServer()).post(url).send(dto).expect(200).expect({ status: 'ok' });

      expect(resetPassword).toHaveBeenNthCalledWith(1, dto);
    });

    it('should return 400 on empty dto', () => {
      const dto = { login: '' };

      return request(app.getHttpServer()).post(url).send(dto).expect(400);
    });

    it('should return 400 on wrong dto', () => {
      const dto = { login: 'll' };

      return request(app.getHttpServer()).post(url).send(dto).expect(400);
    });
  });

  describe('emailConfirm', () => {
    const registerUrl = '/api/auth/email-confirm';

    it.each([[[AuthJwtPermissions.USER]], [[]]])('should reject permission %s', (permissions) => {
      const jwtPayload: IAuthJwtPayload = {
        id: 1,
        username: 'l',
        permissions,
      };
      const jwtService = app.get(JwtService);
      const token = jwtService.sign(jwtPayload, { secret: jwtConfig.secret });

      return request(app.getHttpServer())
        .get(registerUrl)
        .set('Authorization', `Bearer ${token}`)
        .expect(403);
    });

    it('should activate user', async () => {
      const userId = 1;
      const jwtPayload: IAuthJwtPayload = {
        id: userId,
        username: 'l',
        permissions: [AuthJwtPermissions.EMAIL],
      };
      const jwtService = app.get(JwtService);
      const token = jwtService.sign(jwtPayload, { secret: jwtConfig.secret });

      await request(app.getHttpServer())
        .get(registerUrl)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(activateUser).toHaveBeenCalledTimes(userId);
    });
  });

  describe('refresh', () => {
    const refreshUrl = '/api/auth/refresh';

    it('should refresh token', async () => {
      const generatedAccessToken = 'access_token';
      generateAccessTokenFromRefreshToken.mockReturnValueOnce(generatedAccessToken);

      const refreshToken = 'refresh_token';

      await request(app.getHttpServer())
        .post(refreshUrl)
        .send({ refresh_token: refreshToken })
        .expect(200)
        .expect({ type: 'bearer', access_token: generatedAccessToken })
        .expect(() => {
          expect(generateAccessTokenFromRefreshToken).toHaveBeenNthCalledWith(1, refreshToken);
        });
    });

    it('should reject wrong dto', async () => {
      const generatedAccessToken = 'access_token';
      generateAccessTokenFromRefreshToken.mockReturnValueOnce(generatedAccessToken);

      const refreshToken = '';

      return request(app.getHttpServer())
        .post(refreshUrl)
        .send({ refresh_token: refreshToken })
        .expect(400);
    });
  });
});

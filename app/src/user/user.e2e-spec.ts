import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthJwtStrategy } from '../auth/strategy/auth-jwt.strategy';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtConfig } from '../auth/config/jwt.config';

const findOne = jest.fn();

const jwtConfig: JwtConfig = {
  secret: 'secret',
};

const meUrl = '/api/user';

describe('UserController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ConfigService,
          useValue: {
            get: () => jwtConfig,
          },
        },
        JwtService,
        AuthJwtStrategy,
        {
          provide: UserService,
          useValue: { findOne },
        },
      ],
      controllers: [UserController],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(() => {
    findOne.mockReset();
  });

  describe('me', () => {
    it('should reject unauthorized request', async () => {
      findOne.mockReturnValueOnce({});

      return request(app.getHttpServer()).get(meUrl).expect(401);
    });

    it('should return client user', async () => {
      const user = {
        isActive: false,
        login: 'login',
        id: 1,
      };
      const jwtService = app.get(JwtService);
      const token = jwtService.sign(user, { secret: jwtConfig.secret });

      findOne.mockReturnValueOnce(user);

      return request(app.getHttpServer())
        .get(meUrl)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect(user);
    });
  });
});

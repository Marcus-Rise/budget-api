import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UserController } from './user.controller';
import { UserService } from '../service';
import { AuthJwtStrategy } from '../../auth/strategy/auth-jwt.strategy';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtConfig } from '../../auth/config/jwt.config';
import type { User } from '../entities/user.entity';
import { AuthJwtRole, IAuthJwtPayload } from '../../auth/types';

const findOne = jest.fn();
const remove = jest.fn();

const jwtConfig: JwtConfig = {
  secret: 'secret',
};

const userUrl = '/api/user';

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
          useValue: { findOne, remove },
        },
      ],
      controllers: [UserController],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(() => {
    findOne.mockReset();
    remove.mockReset();
  });

  describe('me', () => {
    it('should reject unauthorized request', () => {
      findOne.mockReturnValueOnce({});

      return request(app.getHttpServer()).get(userUrl).expect(401);
    });

    it('should return client user', () => {
      const jwtPayload: IAuthJwtPayload = {
        id: 1,
        username: 'l',
        role: AuthJwtRole.USER,
      };
      const user: User = { id: 1, login: 'l', password: 'p', isActive: true };
      const jwtService = app.get(JwtService);
      const token = jwtService.sign(jwtPayload, { secret: jwtConfig.secret });

      findOne.mockReturnValueOnce(user);

      return request(app.getHttpServer())
        .get(userUrl)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect({ login: 'l' });
    });
  });

  describe('remove', () => {
    it('should reject unauthorized request', () => {
      findOne.mockReturnValueOnce({});

      return request(app.getHttpServer()).get(userUrl).expect(401);
    });

    it('should delete user', async () => {
      const jwtPayload: IAuthJwtPayload = {
        id: 1,
        username: 'l',
        role: AuthJwtRole.USER,
      };
      const jwtService = app.get(JwtService);
      const token = jwtService.sign(jwtPayload, { secret: jwtConfig.secret });

      await request(app.getHttpServer())
        .delete(userUrl)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(remove).toHaveBeenCalledTimes(1);
    });
  });
});

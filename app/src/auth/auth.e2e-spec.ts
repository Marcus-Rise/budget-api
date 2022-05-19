import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

const registerUser = jest.fn();

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        {
          provide: AuthService,
          useValue: { registerUser },
        },
      ],
      controllers: [AuthController],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(new ValidationPipe());

    await app.init();
  });

  describe('register', () => {
    const registerUrl = '/api/auth/register';

    it('should accept valid dto', () => {
      const dto = { login: 'login', password: 'password' };

      registerUser.mockReturnValueOnce(dto);

      return request(app.getHttpServer()).post(registerUrl).send(dto).expect(201).expect(dto);
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

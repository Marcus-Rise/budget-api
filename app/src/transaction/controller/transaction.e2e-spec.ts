import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService } from '../service';
import { TransactionController } from './transaction.controller';
import * as request from 'supertest';
import { mockAuth } from '../../auth/auth.mock';
import { TransactionUpdateDto } from '../dto/transaction-update.dto';
import { TransactionCreateDto } from '../dto/transaction-create.dto';
import { TransactionType } from '../entities/transaction.entity';

const create = jest.fn();
const findAll = jest.fn();
const findOne = jest.fn();
const update = jest.fn();
const remove = jest.fn();

const baseUrl = '/api/transaction';

describe(`TransactionController (e2e) ${baseUrl}`, () => {
  const userId = 1;
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await mockAuth(
      { id: userId },
      Test.createTestingModule({
        providers: [
          {
            provide: TransactionService,
            useValue: {
              create,
              findAll,
              findOne,
              update,
              remove,
            },
          },
        ],
        controllers: [TransactionController],
      }),
    ).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(() => {
    create.mockReset();
    findAll.mockReset();
    findOne.mockReset();
    update.mockReset();
    remove.mockReset();
  });

  describe(`POST /`, () => {
    it('should create user transaction', () => {
      return request(app.getHttpServer())
        .post(baseUrl)
        .send({
          title: 't',
          date: new Date(),
          category: 'c',
          amount: 1,
          type: TransactionType.CREDIT,
        } as TransactionCreateDto)
        .expect(201);
    });
  });

  describe(`GET /`, () => {
    it('should find all user transactions', () => {
      return request(app.getHttpServer()).get(baseUrl).expect(200);
    });
  });

  describe(`GET /:id`, () => {
    it('should find user transaction', () => {
      return request(app.getHttpServer())
        .get(baseUrl + '/1')
        .expect(200);
    });
  });

  describe(`PATCH /:id`, () => {
    it('should update user transaction', () => {
      return request(app.getHttpServer())
        .patch(baseUrl + '/1')
        .send({} as TransactionUpdateDto)
        .expect(200);
    });
  });

  describe(`DELETE /:id`, () => {
    it('should delete user transaction', () => {
      return request(app.getHttpServer())
        .delete(baseUrl + '/1')
        .expect(200);
    });
  });
});

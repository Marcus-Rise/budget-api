import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from './mail.service';
import { MailerService } from '@nestjs-modules/mailer';
import { MailConfig, mailConfig } from './config/mail.config';

const sendMail = jest.fn();
const frontendBaseUrl = 'http://localhost';

describe('MailService', () => {
  let service: MailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: MailerService,
          useValue: {
            sendMail,
          },
        },
        {
          provide: mailConfig.KEY,
          useValue: <MailConfig>{
            frontendBaseUrl,
          },
        },
        MailService,
      ],
    }).compile();

    service = module.get<MailService>(MailService);
  });

  afterEach(() => {
    sendMail.mockReset();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should send mail', async () => {
    const userEmail = 'email';
    const token = 'token';

    await service.sendEmailConfirmation(userEmail, token);

    expect(sendMail).toHaveBeenNthCalledWith(1, {
      to: userEmail,
      subject: 'Добро пожаловать в Бюджет! Подтвердите email',
      template: './email-confirmation',
      context: {
        url: `http://localhost/api/auth/email-confirm?token=${token}&type=bearer`,
      },
    });
  });
});

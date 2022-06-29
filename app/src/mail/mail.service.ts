import { Inject, Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigType } from '@nestjs/config';
import { mailConfig } from './config/mail.config';

@Injectable()
class MailService {
  constructor(
    private readonly _mailerService: MailerService,
    @Inject(mailConfig.KEY)
    private readonly _config: ConfigType<typeof mailConfig>,
  ) {}

  async sendEmailConfirmation(userEmail: string, token: string) {
    const url = new URL('/api/auth/email-confirm', this._config.frontendBaseUrl);
    url.searchParams.set('token', token);
    url.searchParams.set('type', 'bearer');

    return this._mailerService.sendMail({
      to: userEmail,
      subject: 'Добро пожаловать в Бюджет! Подтвердите email',
      template: './email-confirmation',
      context: {
        url: url.toString(),
      },
    });
  }

  async sendResetPassword(userEmail: string, token: string) {
    const url = new URL('/api/auth/reset-password', this._config.frontendBaseUrl);
    url.searchParams.set('token', token);
    url.searchParams.set('type', 'bearer');

    return this._mailerService.sendMail({
      to: userEmail,
      subject: 'Сброс пароля в приложении Бюджет',
      template: './reset-password',
      context: {
        url: url.toString(),
      },
    });
  }
}

export { MailService };

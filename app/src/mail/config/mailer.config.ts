import { MailerOptions } from '@nestjs-modules/mailer/dist/interfaces/mailer-options.interface';
import { ConfigFactory } from '@nestjs/config/dist/interfaces/config-factory.interface';
import { join } from 'path';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { registerAs } from '@nestjs/config';

type MailerConfig = MailerOptions;

const mailerConfigFactory: ConfigFactory<MailerConfig> = () => {
  const port = process.env.MAIL_PORT;
  const preview = process.env.NODE_ENV === 'development';

  return {
    transport: {
      host: process.env.MAIL_HOST,
      port: port ? parseInt(port) : undefined,
      auth: {
        user: process.env.MAIL_LOGIN,
        pass: process.env.MAIL_PASSWORD,
      },
    },
    defaults: { from: `"Бюджет" <${process.env.MAIL_FROM}>` },
    preview,
    template: {
      dir: join(__dirname, '../templates'),
      adapter: new PugAdapter(),
      options: {
        strict: true,
      },
    },
  };
};

const mailerConfig = registerAs('mailer', mailerConfigFactory);

export { mailerConfig };
export type { MailerConfig };

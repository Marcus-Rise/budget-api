import { ConfigFactory } from '@nestjs/config/dist/interfaces/config-factory.interface';
import { registerAs } from '@nestjs/config';

const MAIL_CONFIG_TOKEN = 'mail';

type MailConfig = {
  frontendBaseUrl: string;
};

const mailConfigFactory: ConfigFactory<MailConfig> = () => ({
  frontendBaseUrl: process.env.MAIL_FRONTEND_BASE_URL,
});

const mailConfig = registerAs(MAIL_CONFIG_TOKEN, mailConfigFactory);

export { mailConfig, MAIL_CONFIG_TOKEN };
export type { MailConfig };

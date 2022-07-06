import { ConfigFactory } from '@nestjs/config/dist/interfaces/config-factory.interface';
import { registerAs } from '@nestjs/config';
import { StringValue } from 'ms';

/** expressed in seconds or a string describing a time span [zeit/ms](https://github.com/zeit/ms.js).  Eg: 60, "2 days", "10h", "7d" */
type SessionTTL = StringValue;

const AUTH_CONFIG_TOKEN = 'auth';

type AuthConfig = {
  sessionTTL: SessionTTL;
  tokenTTL: SessionTTL;
  registrationEmailTokenTTL: SessionTTL;
  resetPasswordEmailTokenTTL: SessionTTL;
};

const authConfigFactory: ConfigFactory<AuthConfig> = () => ({
  sessionTTL: process.env.SESSION_TTL as StringValue,
  tokenTTL: process.env.TOKEN_TTL as StringValue,
  registrationEmailTokenTTL: process.env.REGISTRATION_EMAIL_TOKEN_TTL as StringValue,
  resetPasswordEmailTokenTTL: process.env.RESET_PASSWORD_EMAIL_TOKEN_TTL as StringValue,
});

const authConfig = registerAs(AUTH_CONFIG_TOKEN, authConfigFactory);

export { authConfig, AUTH_CONFIG_TOKEN };
export type { AuthConfig, SessionTTL };

import { ConfigFactory } from '@nestjs/config/dist/interfaces/config-factory.interface';
import { registerAs } from '@nestjs/config';

const AUTH_CONFIG_TOKEN = 'auth';

type AuthConfig = {
  sessionTTL: number;
};

const authConfigFactory: ConfigFactory<AuthConfig> = () => ({
  sessionTTL: parseInt(process.env.SESSION_TTL),
});

const authConfig = registerAs(AUTH_CONFIG_TOKEN, authConfigFactory);

export { authConfig, AUTH_CONFIG_TOKEN };
export type { AuthConfig };

import { ConfigFactory } from '@nestjs/config/dist/interfaces/config-factory.interface';
import { registerAs } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt/dist/interfaces/jwt-module-options.interface';

const JWT_CONFIG_TOKEN = 'jwt';

type JwtConfig = JwtModuleOptions;

const jwtConfigFactory: ConfigFactory<JwtConfig> = () => ({
  secret: process.env.JWT_SECRET,
  signOptions: {
    expiresIn: '60s',
    audience: process.env.JWT_AUDIENCE,
    issuer: process.env.JWT_ISSUER,
  },
});
const jwtConfig = registerAs(JWT_CONFIG_TOKEN, jwtConfigFactory);

export { jwtConfig, JWT_CONFIG_TOKEN };
export type { JwtConfig };

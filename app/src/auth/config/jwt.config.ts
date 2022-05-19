import { ConfigFactory } from '@nestjs/config/dist/interfaces/config-factory.interface';
import { registerAs } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt/dist/interfaces/jwt-module-options.interface';

type JwtConfig = JwtModuleOptions;

const jwtConfigFactory: ConfigFactory<JwtConfig> = () => ({
  secret: process.env.JWT_SECRET,
  signOptions: {
    expiresIn: '60s',
  },
});

const jwtConfig = registerAs('jwt', jwtConfigFactory);

export { jwtConfig };
export type { JwtConfig };

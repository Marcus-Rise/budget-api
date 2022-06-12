import { Module } from '@nestjs/common';
import { AuthService } from './service';
import { AuthController } from './controller';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { AuthLocalStrategy } from './strategy/auth-local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { JwtConfig, jwtConfig } from './config/jwt.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshToken } from './entities/refresh-token.entity';
import { authConfig } from './config/auth.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([RefreshToken]),
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule.forFeature(jwtConfig)],
      inject: [jwtConfig.KEY],
      useFactory: (config: JwtConfig) => config,
    }),
    ConfigModule.forFeature(authConfig),
  ],
  providers: [AuthService, AuthLocalStrategy],
  controllers: [AuthController],
})
export class AuthModule {}

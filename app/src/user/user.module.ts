import { Module } from '@nestjs/common';
import { UserService } from './service';
import { UserController } from './controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthJwtStrategy } from '../auth/strategy/auth-jwt.strategy';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService, ConfigService, AuthJwtStrategy],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}

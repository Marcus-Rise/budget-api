import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseConfig, databaseConfig } from './config/database.config';
import { AuthModule } from './auth/auth.module';
import { ScheduleModule } from '@nestjs/schedule';
import { APP_GUARD } from '@nestjs/core';
import { PermissionGuard } from './auth/guard/permission-guard.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forFeature(databaseConfig)],
      inject: [databaseConfig.KEY],
      useFactory: (config: DatabaseConfig) => config,
    }),
    ScheduleModule.forRoot(),
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [{ provide: APP_GUARD, useClass: PermissionGuard }, AppService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule } from '@nestjs/config';
import { MailerConfig, mailerConfig } from './config/mailer.config';
import { mailConfig } from './config/mail.config';

@Module({
  imports: [
    ConfigModule.forFeature(mailConfig),
    MailerModule.forRootAsync({
      imports: [ConfigModule.forFeature(mailerConfig)],
      inject: [mailerConfig.KEY],
      useFactory: (config: MailerConfig) => config,
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}

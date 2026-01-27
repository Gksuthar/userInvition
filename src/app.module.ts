import { CacheModule } from './cache/cache.module';
import { MailerModule } from './mailer/mailer.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { EmailTemplateModule } from './email-template/email-template.module';
import { UsersModule } from './users/users.module';
import { BullModule } from '@nestjs/bull';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: Number(process.env.REDIS_PORT) || 6379,
      },
    }),
    PrismaModule,
    AuthModule,
    EmailTemplateModule,
    MailerModule,
    CacheModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

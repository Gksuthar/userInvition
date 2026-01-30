import { CacheModule } from './cache/cache.module';
import { MailerModule } from './mailer/mailer.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { EmailTemplateModule } from './email-template/email-template.module';
import { UsersModule } from './users/users.module';
import { BullModule } from '@nestjs/bull';
import { LoggerModule } from 'nestjs-pino';
import { SubscriptionModule } from './subscription/subscription.module';
import { CategoryModule } from './Category/category.module';
import { TenantModule } from './Tenant/Tenant.module';
import { UserTenantModule } from './userTenant/UserTenant.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: Number(process.env.REDIS_PORT) || 6379,
      },
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:standard',
          },
        },

        serializers: {
          req(req) {
            return {
              id: req.id,
              method: req.method,
              url: req.url,
            };
          },
          res(res) {
            return {
              statusCode: res.statusCode,
            };
          },
        },
      },
    }),
    PrismaModule,
    UserTenantModule,
    TenantModule,
    CategoryModule,
    AuthModule,
    EmailTemplateModule,
    MailerModule,
    CacheModule,
    UsersModule,
    SubscriptionModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }

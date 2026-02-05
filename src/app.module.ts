import { CacheModule } from './cache/cache.module';
import { MailerModule } from './mailer/mailer.module';
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
import { PlanModule } from './plan/plan.module';
import { StripeModule } from './stripe/stripe.module';
import { ThrottlerModule, ThrottlerGuard, minutes } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: minutes(1),
          limit: 10,
        },
      ],
      errorMessage: (context, detail) => {
        const req = context.switchToHttp().getRequest();

        if (req.url.includes('/user/signin')) {
          return 'Too many login attempts. Please try again after some time.';
        }
        return 'Too many requests. Please try again after some time.';
      },
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
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
    PlanModule,
    CacheModule,
    UsersModule,
    SubscriptionModule,
    StripeModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}

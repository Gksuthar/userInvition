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
import { Module } from '@nestjs/common';

@Module({
  imports: [
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
  providers: [],
})
export class AppModule {}

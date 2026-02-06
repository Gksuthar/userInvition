import { AdminAuthController } from './admin-auth.controller';
import { EmailTemplateModule } from './../email-template/email-template.module';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RefreshJwtStrategy } from './strategies/refresh-jwt.strategy';
import { PrismaModule } from '../prisma/prisma.module';
import { MailerModule } from 'src/mailer/mailer.module';
import { AuthHelperService } from './auth.helper';
import { TenantController } from 'src/Tenant/Tenant.controller';
import { TenantModule } from 'src/Tenant/Tenant.module';
import { UserTenantModule } from 'src/userTenant/UserTenant.module';
import { UserAuthController } from './user-auth.controller';
import { AuthUserService } from './user-auth.service';
import { AuthAdminService } from './admin-auth.service';
import { AuthUserRepository } from './user-auth.repositories';
import { AuthAdminRepository } from './admin-auth.repositories';
@Module({
  imports: [
    PassportModule,
    JwtModule.register({}),
    PrismaModule,
    MailerModule,
    EmailTemplateModule,
    TenantModule,
    UserTenantModule,
  ],
  providers: [
    AuthUserRepository,
    AuthAdminRepository,
    AuthUserService,
    AuthAdminService,
    JwtStrategy,
    RefreshJwtStrategy,
    AuthHelperService,
    TenantController,
  ],
  controllers: [AdminAuthController, UserAuthController],
  exports: [AuthUserService, AuthAdminService],
})
export class AuthModule {}

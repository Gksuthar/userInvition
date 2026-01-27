import { EmailTemplateModule } from './../email-template/email-template.module';
import { Module } from '@nestjs/common';
import { AuthAdminService, AuthUserService } from './auth.service';
import { AdminAuthController, UserAuthController } from './auth.controller';
import { AuthAdminRepository, AuthUserRepository } from './auth.repositories';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RefreshJwtStrategy } from './strategies/refresh-jwt.strategy';
import { PrismaModule } from '../prisma/prisma.module';
import { MailerModule } from 'src/mailer/mailer.module';
import { AuthHelperService } from './auth.helper';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({}),
    PrismaModule,
    MailerModule,
    EmailTemplateModule,
  ],
  providers: [
    AuthUserRepository,
    AuthAdminRepository,
    AuthUserService,
    AuthAdminService,
    JwtStrategy,
    RefreshJwtStrategy,
    AuthHelperService,
  ],
  controllers: [AdminAuthController, UserAuthController],
  exports: [AuthUserService, AuthAdminService],
})
export class AuthModule {}

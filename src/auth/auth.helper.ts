import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CacheService } from 'src/cache/cache.service';
import { EmailTemplateService } from 'src/email-template/email-template.service';
import { EmailBullConfigService } from 'src/mailer/email-bull-config.service';
import { OtpDto } from './dto/otp.dto';
import { Logger } from 'nestjs-pino';
import { AuthAdminRepository } from './admin-auth.repositories';
import { AuthUserRepository } from './user-auth.repositories';

@Injectable()
export class AuthHelperService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly cacheService: CacheService,
    private readonly emailTemplateService: EmailTemplateService,
    private readonly emailBullConfigService: EmailBullConfigService,
    private readonly authUserRepository: AuthUserRepository,
    private readonly authAdminRepository: AuthAdminRepository,
    private readonly logger: Logger,
  ) {}

  generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  generateTokens(userId: string, email: string, role: string) {
    const payload = { sub: userId, email, role };
    this.logger.log(
      { email },
      'request received for generate jwt and refresh token',
    );
    return {
      accessToken: this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '15m',
      }),
      refreshToken: this.jwtService.sign(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '7d',
      }),
    };
  }

  async sendOtp(email: string, name: string, role: 'admin' | 'user') {
    const otp = this.generateOtp();

    await this.cacheService.set(`${role}:otp:${email}`, otp, 300);

    const template = await this.emailTemplateService.findByType(
      role === 'admin' ? 'ADMIN_SIGNUP_OTP' : 'USER_SIGNUP_OTP',
    );

    if (!template) {
      this.logger.warn({ email }, 'Email template not found');
      throw new InternalServerErrorException('Email template not found');
    }

    const body = template.body
      .replace('{{name}}', name)
      .replace('{{otp}}', otp);

    await this.emailBullConfigService.addEmailToQueue(
      email,
      template.subject,
      body,
    );
  }

  // async verifyOtp(email: string, otp: string, role: 'admin' | 'user') {
  //   const key = `${role}:otp:${email}`;
  //   const savedOtp = await this.cacheService.get(key);

  //   if (!savedOtp) throw new ConflictException('OTP expired');
  //   if (savedOtp !== otp) throw new ConflictException('Invalid OTP');

  //   await this.cacheService.del(key);
  //   const templateType = role === 'admin' ? 'USER_WELCOME' : 'ADMIN_WELCOME'
  //   const template = await this.emailTemplateService.findByType(templateType);
  //   if (!template) {
  //     throw new ConflictException("USER_WELCOME template not found")
  //   }
  //   const body = template.body.replace('email', email);

  //   await this.emailBullConfigService.addEmailToQueue(
  //     email,
  //     template.subject,
  //     body,
  //   );
  //   return {
  //     message: `${role} verified successfully`,
  //     email,
  //   };
  // }

  async sendOtpForVerify(
    adminEmail: string,
    adminName: string,
    role: string,
  ): Promise<void> {
    const otp = this.generateOtp();
    await this.cacheService.set(
      `${role === 'admin' ? 'admin' : 'user'}:otp:${adminEmail}`,
      otp,
      300,
    );

    const template =
      await this.emailTemplateService.findByType('ADMIN_SIGNUP_OTP');
    if (!template) {
      this.logger.warn('Email template not found');
      throw new InternalServerErrorException('Email template not found');
    }

    const body = template.body
      .replace('{{name}}', adminName)
      .replace('{{otp}}', otp);

    try {
      await this.emailBullConfigService.addEmailToQueue(
        adminEmail,
        template.subject,
        body,
      );
    } catch (error: any) {
      this.logger.warn('Failed to send email', error);
      throw new InternalServerErrorException('Failed to send email');
    }
  }

  async verifyUserOrAdmin(verifyData: OtpDto, role: 'admin' | 'user') {
    const { email, otp } = verifyData;

    const key = `${role}:otp:${email}`;
    const savedOtp = await this.cacheService.get(key);

    if (!savedOtp) {
      this.logger.warn({ email }, 'OTP expired or not found');
      throw new ConflictException('OTP expired or not found');
    }

    if (String(savedOtp) !== String(otp)) {
      this.logger.warn({ email }, 'Invalid OTP');
      throw new ConflictException('Invalid OTP');
    }

    await this.cacheService.del(key);
    const TemplateType = role === 'user' ? 'USER_WELCOME' : 'ADMIN_WELCOME';
    // if (role === 'user') {
    this.logger.log({ TemplateType, message: 'template is loading ' });
    const template = await this.emailTemplateService.findByType(TemplateType);

    if (!template) {
      if (role === 'admin') {
        this.logger.warn({ email }, 'ADMIN_WELCOME template not found');
        throw new ConflictException('ADMIN_WELCOME template not found');
      } else {
        this.logger.warn({ email }, 'USER_WELCOME template not found');
        throw new ConflictException('USER_WELCOME template not found');
      }
    }

    const body = template.body.replace('{{email}}', email);

    await this.emailBullConfigService.addEmailToQueue(
      email,
      template.subject,
      body,
    );
    if (role === 'user') {
      await this.authUserRepository.userVerify(email);
      this.logger.log({ email }, 'User verified successfully');
      return {
        message: 'User verified successfully',
        email,
      };
    } else {
      await this.authAdminRepository.adminVerify(email);
      this.logger.log({ email }, 'Admin verified successfully');
      return {
        message: 'Admin verified successfully',
        email,
      };
    }
  }
}

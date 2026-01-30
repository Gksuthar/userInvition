import { TenantController } from './../Tenant/Tenant.controller';
import { VerifyOtpResponseDto } from './dto/verify-otp-response.dto';
import { OtpDto } from './dto/otp.dto';
import { RegisterDto } from './dto/register.dto';
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import bcrypt from 'bcryptjs';

import { LoginDto } from './dto/login.dto';
import { AuthHelperService } from './auth.helper';
import { Logger } from 'nestjs-pino';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterResponseDto } from './dto/register-response.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { UserTenantService } from 'src/userTenant/UserTenant.service';
import { AuthUserRepository } from './user-auth.repositories';
@Injectable()
export class AuthUserService {
  constructor(
    private readonly authUserRepository: AuthUserRepository,
    private readonly authHelperService: AuthHelperService,
    private readonly logger: Logger,
    private readonly prisma: PrismaService,
    private readonly tenantController: TenantController,
    private readonly userTenantService: UserTenantService,
  ) {}

  async registerUser(registerDto: RegisterDto): Promise<RegisterResponseDto> {
    const role = 'user';
    const { email, password, name, slug } = registerDto;
    this.logger.log('User registration started', { email });

    const existingAdmin = await this.authUserRepository.findUserByEmail(email);
    if (existingAdmin) {
      this.logger.warn({ email }, 'User already exists');
      throw new ConflictException('User already exists');
    }

    await this.authHelperService.sendOtpForVerify(email, name, role);
    this.logger.log({ email }, 'OTP sent to user email');
    const hashedPassword = await bcrypt.hash(password, 10);
    const tenant = slug
      ? await this.tenantController.findTenantBySlugController(slug)
      : null;
    this.logger.log({ tenant }, 'the data is ----------------------------->');
    let tenantId = tenant ? tenant?.id : null;
    const user: User | null = await this.authUserRepository.createUser({
      email,
      password: hashedPassword,
      name,
    });
    if (!user) {
      this.logger.error({ email }, 'Failed to create user');
      throw new ConflictException('Failed to create user');
    }
    if (tenantId) {
      await this.userTenantService.createUserTenant({
        user_id: user.id,
        tenant_id: tenantId as string,
      });
    }

    // Attach role-based permission to the new user
    const userPermission = await this.prisma.permission.findFirst({
      where: { name: role },
    });

    if (userPermission) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: { permission_id: userPermission.id },
      });
    }

    this.logger.log({ userId: user.id, email }, 'User registered successfully');

    return {
      message: 'User registered successfully. OTP sent to email.',
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        is_verified: user.is_verified,
      },
    };
  }

  async loginUser(loginDto: LoginDto): Promise<LoginResponseDto> {
    const { email, password } = loginDto;
    this.logger.log('User Login started', { email });

    const existingUser: User | null =
      await this.authUserRepository.findUserByEmail(email);
    if (!existingUser) {
      this.logger.warn('User already exists', { email });
      throw new ConflictException('User already exists');
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password,
    );

    if (!isPasswordValid) {
      this.logger.warn('Invalid credentials', { email });
      throw new UnauthorizedException('Invalid credentials');
    }

    const isverify: boolean = existingUser.is_verified;
    if (!isverify) {
      await this.authHelperService.sendOtpForVerify(
        existingUser.email,
        existingUser.name,
        'user',
      );
      this.logger.warn(
        { email: existingUser.email },
        'Please verify your email. OTP has been sent again.',
      );
      throw new UnauthorizedException(
        'Please verify your email. OTP has been sent again.',
      );
    }

    const isDeletedUser = existingUser.delete_by_id;
    if (isDeletedUser) {
      this.logger.warn(
        { email: existingUser.email },
        'Deleted user attempted to login',
      );

      throw new UnauthorizedException(
        'Your account has been deleted. Please contact support.',
      );
    }

    const tokens = this.authHelperService.generateTokens(
      existingUser.id,
      existingUser.email,
      existingUser.role,
    );
    this.logger.log({ email }, 'Login successful');
    return {
      message: 'User login successfully.',
      data: {
        id: existingUser.id,
        email: existingUser.email,
        name: existingUser.name,
        is_verified: existingUser.is_verified,
      },
      tokens,
    };
  }

  async verifyUser(verifyData: OtpDto): Promise<VerifyOtpResponseDto> {
    const role = 'user';
    return await this.authHelperService.verifyUserOrAdmin(verifyData, role);
  }
}
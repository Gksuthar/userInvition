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
import { Admin } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterResponseDto } from './dto/register-response.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { AuthAdminRepository } from './admin-auth.repositories';
// import { UserTenantService } from 'src/userTenant/UserTenant.service';

@Injectable()
export class AuthAdminService {
  constructor(
    private readonly authAdminRepository: AuthAdminRepository,
    private readonly authHelperService: AuthHelperService,
    private readonly logger: Logger,
    private readonly prisma: PrismaService,
    private readonly tenantController: TenantController,
  ) {}

  async registerAdmin(
    registerDto: RegisterDto,
  ): Promise<RegisterResponseDto> {
    const role = 'admin';
    const { email, password, name, slug } = registerDto;
    this.logger.log('Admin registration started', { email });

    const existingAdmin =
      await this.authAdminRepository.findAdminByEmail(email);
    if (existingAdmin) {
      this.logger.warn({ email }, 'Admin already exists');
      throw new ConflictException('Admin already exists');
    }

    await this.authHelperService.sendOtpForVerify(email, name, role);
    this.logger.log({ email }, 'OTP sent to admin email');
    const hashedPassword = await bcrypt.hash(password, 10);
    const tenant = slug
      ? await this.tenantController.findTenantBySlugController(slug)
      : null;
    this.logger.log({ tenant }, 'admin tenant data');
    const tenantId = tenant ? tenant.id : null;

    const admin: Admin | null = await this.authAdminRepository.createAdmin({
      email,
      password: hashedPassword,
      name,
      tenant_id: tenantId,
    });

    if (!admin) {
      this.logger.error({ email }, 'Failed to create admin');
      throw new ConflictException('Failed to create admin');
    }

    const adminPermission = await this.prisma.permission.findFirst({
      where: { name: role },
    });

    if (adminPermission) {
      await this.prisma.admin.update({
        where: { id: admin.id },
        data: { permission_id: adminPermission.id },
      });
    }

    this.logger.log(
      { adminId: admin.id, email },
      'Admin registered successfully',
    );

    return {
      message: 'Admin registered successfully. OTP sent to email.',
      data: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        is_verified: admin.is_verified,
      },
    };
  }

  async loginAdmin(loginDto: LoginDto): Promise<LoginResponseDto> {
    const { email, password } = loginDto;
    this.logger.log('Admin login started', { email });

    const existingAdmin: Admin | null =
      await this.authAdminRepository.findAdminByEmail(email);
    if (!existingAdmin) {
      this.logger.warn('Admin does not exist', { email });
      throw new ConflictException('Admin does not exist');
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      existingAdmin.password,
    );

    if (!isPasswordValid) {
      this.logger.warn('Invalid credentials', { email });
      throw new UnauthorizedException('Invalid credentials');
    }

    const isVerified = existingAdmin.is_verified;
    if (!isVerified) {
      await this.authHelperService.sendOtpForVerify(
        existingAdmin.email,
        existingAdmin.name,
        'admin',
      );
      this.logger.warn(
        { email: existingAdmin.email },
        'Please verify your email. OTP has been sent again.',
      );
      throw new UnauthorizedException(
        'Please verify your email. OTP has been sent again.',
      );
    }

    const isDeletedAdmin = existingAdmin.delete_by_id;
    if (isDeletedAdmin) {
      this.logger.warn(
        { email: existingAdmin.email },
        'Deleted admin attempted to login',
      );

      throw new UnauthorizedException(
        'Your account has been deleted. Please contact support.',
      );
    }
    const role = existingAdmin.is_supreme_admin ? 'super_Admin' : 'admin';
    const tokens = this.authHelperService.generateTokens(
      existingAdmin.id,
      existingAdmin.email,
      role,
    );
    this.logger.log({ email }, 'Admin login successful');
    return {
      message: 'Admin login successfully.',
      data: {
        id: existingAdmin.id,
        email: existingAdmin.email,
        name: existingAdmin.name,
        is_verified: existingAdmin.is_verified,
      },
      tokens,
      is_supreme_admin: existingAdmin.is_supreme_admin,
    };
  }

  async verifyAdmin(verifyData: OtpDto): Promise<VerifyOtpResponseDto> {
    const role = 'admin';
    return await this.authHelperService.verifyUserOrAdmin(verifyData, role);
  }
}


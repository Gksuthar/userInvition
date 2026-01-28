import { VerifyOtpResponseDto } from './dto/verify-otp-response.dto';
import { OtpDto } from './dto/otp.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthAdminRepository, AuthUserRepository } from './auth.repositories';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import bcrypt from 'bcryptjs';

import { LoginDto } from './dto/login.dto';
import { AuthHelperService } from './auth.helper';
import { Logger } from 'nestjs-pino';
import { User } from 'generated/prisma';
import { RegisterResponseDto } from './dto/register-response.dto';
import { LoginResponseDto } from './dto/login-response.dto';

@Injectable()
export class AuthUserService {
  constructor(
    private readonly authUserRepository: AuthUserRepository,
    private readonly authHelperService: AuthHelperService,
    private readonly logger: Logger,
  ) {}

  async registerUser(registerDto: RegisterDto): Promise<RegisterResponseDto> {
    const role = 'user';
    const { email, password, name } = registerDto;
    this.logger.log('User registration started', { email });

    const existingAdmin = await this.authUserRepository.findUserByEmail(email);
    if (existingAdmin) {
      this.logger.warn({ email }, 'User already exists');
      throw new ConflictException('User already exists');
    }

    await this.authHelperService.sendOtpForVerify(email, name, role);
    this.logger.log({ email }, 'OTP sent to user email');

    const hashedPassword = await bcrypt.hash(password, 10);

    const user: User | null = await this.authUserRepository.createUser({
      email,
      password: hashedPassword,
      name,
    });
    if (!user) {
      this.logger.error({ email }, 'Failed to create user');
      throw new ConflictException('Failed to create user');
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

    const existingUser: User | null = await this.authUserRepository.findUserByEmail(email);
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

    const tokens = await this.authHelperService.generateTokens(
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

@Injectable()
export class AuthAdminService {
  constructor(
    private readonly authRepository: AuthAdminRepository,
    private readonly authHelperService: AuthHelperService,
    private readonly logger: Logger,
  ) {}

  async registerAdmin(registerDto: RegisterDto): Promise<RegisterResponseDto> {
    const role = 'admin';
    const { email, password, name } = registerDto;

    const existingAdmin = await this.authRepository.findAdminByEmail(email);
    if (existingAdmin) {
      this.logger.warn({ email }, 'email is already exist');
      throw new ConflictException('Admin already exists');
    }

    await this.authHelperService.sendOtpForVerify(email, name, role);

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await this.authRepository.createAdmin({
      email,
      password: hashedPassword,
      name,
    });
    if (!admin) {
      this.logger.warn({ email }, 'Admin is not created plz try again ');
      throw new InternalServerErrorException(
        'Admin could not be created. Please try again.',
      );
    }

    this.logger.log(
      { email },
      'Admin registered successfully. OTP sent to email',
    );

    // const tokens = await this.generateTokens(admin.id, admin.email, 'admin');
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
    const existingAdmin = await this.authRepository.findAdminByEmail(email);

    if (!existingAdmin) {
      this.logger.warn({ email }, 'Admin already exists');
      throw new UnauthorizedException('Admin already exists');
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      existingAdmin.password,
    );
    if (!isPasswordValid) {
      this.logger.warn({ email }, 'Invalid credentials');
      throw new UnauthorizedException('Invalid credentials');
    }

    const isverify = existingAdmin.is_verified;
    if (!isverify) {
      await this.authHelperService.sendOtpForVerify(
        existingAdmin.email,
        existingAdmin.name,
        'admin',
      );
      this.logger.warn(
        { email },
        'Please verify your email. OTP has been sent again',
      );

      throw new UnauthorizedException(
        'Please verify your email. OTP has been sent again.',
      );
    }

    const isDeletedUser = existingAdmin.delete_by_id;
    if (isDeletedUser) {
      this.logger.warn(
        { email },
        'Your account has been deleted. Please contact support',
      );
      throw new UnauthorizedException(
        'Your account has been deleted. Please contact support.',
      );
    }

    const tokens = await this.authHelperService.generateTokens(
      existingAdmin.id,
      existingAdmin.email,
      existingAdmin.role,
    );
    this.logger.log({ email }, 'Admin login successfully.');
    return {
      message: 'Admin login successfully.',
      data: {
        id: existingAdmin.id,
        email: existingAdmin.email,
        name: existingAdmin.name,
        is_verified: existingAdmin.is_verified,
      },
      tokens,
    };
  }

  async verifyAdmin(verifyData: OtpDto): Promise<VerifyOtpResponseDto> {
    const role = 'admin';
    return await this.authHelperService.verifyUserOrAdmin(verifyData, role);
  }
}

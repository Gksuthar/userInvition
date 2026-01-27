import { OtpDto } from './dto/otp.dto';
import { CacheService } from './../cache/cache.service';
import { RegisterDto } from './dto/register.dto';
import { AuthAdminRepository, AuthUserRepository } from './auth.repositories';
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { AuthHelperService } from './auth.helper';

@Injectable()
export class AuthUserService {
  constructor(
    private readonly authUserRepository: AuthUserRepository,
    private readonly cacheService: CacheService,
    private readonly authHelperService: AuthHelperService,
  ) {}

  async registerUser(registerDto: RegisterDto) {
    const role = 'user';
    const { email, password, name } = registerDto;

    const existingAdmin = await this.authUserRepository.findUserByEmail(email);
    if (existingAdmin) {
      throw new ConflictException('User already exists');
    }

    await this.authHelperService.sendOtpForVerify(email, name, role);

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.authUserRepository.createUser({
      email,
      password: hashedPassword,
      name,
    });


    return {
      message: 'User registered successfully. OTP sent to email.',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        is_verified: user.is_verified,
      },
    };
  }



  async loginUser(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const existingUser = await this.authUserRepository.findUserByEmail(email);
    if (!existingUser) {
      throw new ConflictException('User already exists');
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isverify = await existingUser.is_verified;
    if (!isverify) {
      await this.authHelperService.sendOtpForVerify(existingUser.email, existingUser.name, 'user');
      throw new UnauthorizedException(
        'Please verify your email. OTP has been sent again.',
      );
    }

    const isDeletedUser = await existingUser.delete_by_id;
    if (isDeletedUser) {
      throw new UnauthorizedException(
        'Your account has been deleted. Please contact support.',
      );
    }

    const tokens = await this.authHelperService.generateTokens(
      existingUser.id,
      existingUser.email,
      existingUser.role,
    );
    return {
      message: 'User login successfully.',
      admin: {
        id: existingUser.id,
        email: existingUser.email,
        name: existingUser.name,
        is_verified: existingUser.is_verified,
      },
      tokens,
    };
  }


  async verifyUser(verifyData: OtpDto) {
    const { email, otp } = verifyData;
    const savedOtp = await this.cacheService.get(`user:otp:${email}`);
    if (!savedOtp) {
      throw new ConflictException('OTP expired or not found');
    }
    if (savedOtp !== otp) {
      throw new ConflictException('Invalid OTP');
    }
    await this.cacheService.del(`user:otp:${email}`);
    await this.authUserRepository.userVerify(email);
    return {
      message: 'user verified successfully',
      email: email,
    };
  }
}

@Injectable()
export class AuthAdminService {
  constructor(
    private readonly authRepository: AuthAdminRepository,
    private cacheService: CacheService,
    private readonly authHelperService: AuthHelperService,

  ) {}

  async registerAdmin(registerDto: RegisterDto) {
    const role = 'admin';
    const { email, password, name } = registerDto;

    const existingAdmin = await this.authRepository.findAdminByEmail(email);
    if (existingAdmin) {
      throw new ConflictException('Admin already exists');
    }

    await this.authHelperService.sendOtpForVerify(email, name, role);

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await this.authRepository.createAdmin({
      email,
      password: hashedPassword,
      name,
    });

    // const tokens = await this.generateTokens(admin.id, admin.email, 'admin');

    return {
      message: 'Admin registered successfully. OTP sent to email.',
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        is_verified: admin.is_verified,
      },
    };
  }

  async loginAdmin(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const existingAdmin = await this.authRepository.findAdminByEmail(email);

    if (!existingAdmin) {
      throw new UnauthorizedException('Admin already exists');
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      existingAdmin.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isverify = await existingAdmin.is_verified;
    if (!isverify) {
      await this.authHelperService.sendOtpForVerify(existingAdmin.email, existingAdmin.name, 'admin');
      throw new UnauthorizedException(
        'Please verify your email. OTP has been sent again.',
      );
    }

    const isDeletedUser = await existingAdmin.delete_by_id;
    if (isDeletedUser) {
      throw new UnauthorizedException(
        'Your account has been deleted. Please contact support.',
      );
    }

    const tokens = await this.authHelperService.generateTokens(
      existingAdmin.id,
      existingAdmin.email,
      existingAdmin.role,
    );
    return {
      message: 'Admin login successfully.',
      admin: {
        id: existingAdmin.id,
        email: existingAdmin.email,
        name: existingAdmin.name,
        is_verified: existingAdmin.is_verified,
      },
      tokens,
    };
  }

  async verifyAdmin(verifyData: OtpDto) {
    const role = 'admin';
    return await this.authHelperService.verifyUserOrAdmin(verifyData, role);
  }
}
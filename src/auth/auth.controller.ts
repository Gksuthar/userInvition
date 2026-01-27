import { OtpDto } from './dto/otp.dto';
import { Body, Controller, Post } from '@nestjs/common';
import { AuthAdminService, AuthUserService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ApiTags, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Admin Authentication')
@Controller('auth/admin')
export class AdminAuthController {
  constructor(private authService: AuthAdminService) {}

  @Post('signup')
  async registerUser(@Body() registerDto: RegisterDto) {
    return this.authService.registerAdmin(registerDto);
  }

  @ApiOperation({ summary: 'Verify Admin OTP' })
  @ApiBody({ type: OtpDto })
  @ApiResponse({ status: 200, description: 'Admin verified successfully.' })
  @Post('verify-signup-code')
  verifyOtp(@Body() otpDto: OtpDto) {
    return this.authService.verifyAdmin(otpDto);
  }

  @ApiOperation({ summary: 'Admin Login' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Admin login successfully.' })
  @Post('signin')
  async loginAdmin(@Body() loginDto: LoginDto) {
    return this.authService.loginAdmin(loginDto);
  }
}

@ApiTags('User Authentication')
@Controller('user')
export class UserAuthController {
  constructor(private authService: AuthUserService) {}

  @ApiOperation({ summary: 'Register User' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully. OTP sent to email.',
  })
  @Post('signup')
  async registerUser(@Body() registerDto: RegisterDto) {
    return this.authService.registerUser(registerDto);
  }

  @ApiOperation({ summary: 'Verify User OTP' })
  @ApiBody({ type: OtpDto })
  @ApiResponse({ status: 200, description: 'User verified successfully.' })
  @Post('verify-signup-code')
  verifyUserOtp(@Body() otpDto: OtpDto) {
    return this.authService.verifyUser(otpDto);
  }

  @ApiOperation({ summary: 'User Login' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'User login successfully.' })
  @Post('signin')
  async loginUser(@Body() loginDto: LoginDto) {
    return this.authService.loginUser(loginDto);
  }
}

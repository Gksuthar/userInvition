import { VerifyOtpResponseDto } from './dto/verify-otp-response.dto';
import { OtpDto } from './dto/otp.dto';
import { Body, Controller, Post } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ApiTags, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';
import { RegisterResponseDto } from './dto/register-response.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { AuthAdminService } from './admin-auth.service';

@ApiTags('Admin Authentication')
@Controller('auth/admin')
export class AdminAuthController {
  constructor(
    private authService: AuthAdminService,
    private logger: Logger,
  ) {}

  @Post('signup')
  async registerUser(@Body() registerDto: RegisterDto): Promise<RegisterResponseDto> {
    this.logger.log(
      { email: registerDto.email },
      'Admin signup request received',
    );
    return this.authService.registerAdmin(registerDto);
  }

  @ApiOperation({ summary: 'Verify Admin OTP' })
  @ApiBody({ type: OtpDto })
  @ApiResponse({ status: 200, description: 'Admin verified successfully.' })
  @Post('verify-signup-code')
  verifyOtp(@Body() otpDto: OtpDto): Promise<VerifyOtpResponseDto> {
    this.logger.log(
      { email: otpDto.email },
      'otp verification request received',
    );
    return this.authService.verifyAdmin(otpDto);
  }

  @ApiOperation({ summary: 'Admin Login' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Admin login successfully.' })
  @Post('signin')
  async loginAdmin(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    this.logger.log({ email: loginDto.email }, 'Admin signin request received');
    return this.authService.loginAdmin(loginDto);
  }
}

// @ApiTags('User Authentication')
// @Controller('user')
// export class UserAuthController {
//   constructor(
//     private authService: AuthUserService,
//     private readonly logger: Logger,
//   ) {}

//   @ApiOperation({ summary: 'Register User' })
//   @ApiBody({ type: RegisterDto })
//   @ApiResponse({
//     status: 201,
//     description: 'User registered successfully. OTP sent to email.',
//   })
//   @Post('signup')
//   async registerUser(@Body() registerDto: RegisterDto): Promise<RegisterResponseDto> {
//     this.logger.log(
//       { email: registerDto.email },
//       'User signup request received',
//     );
//     return this.authService.registerUser(registerDto);
//   }

//   @ApiOperation({ summary: 'Verify User OTP' })
//   @ApiBody({ type: OtpDto })
//   @ApiResponse({ status: 200, description: 'User verified successfully.' })
//   @Post('verify-signup-code')
//   verifyUserOtp(@Body() otpDto: OtpDto): Promise<VerifyOtpResponseDto> {
//     this.logger.log({
//       email: otpDto.email,
//       message: 'User OTP verification attempt',
//     });
//     return this.authService.verifyUser(otpDto);
//   }

//   @ApiOperation({ summary: 'User Login' })
//   @ApiBody({ type: LoginDto })
//   @ApiResponse({ status: 200, description: 'User login successfully.' })
//   @Post('signin')
//   async loginUser(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
//     this.logger.log({
//       email: loginDto.email,
//       message: 'User signin request received',
//     });
//     return this.authService.loginUser(loginDto);
//   }
// }

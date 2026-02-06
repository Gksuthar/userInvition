import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';
import { RegisterDto } from './dto/register.dto';
import { RegisterResponseDto } from './dto/register-response.dto';
import { VerifyOtpResponseDto } from './dto/verify-otp-response.dto';
import { OtpDto } from './dto/otp.dto';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { AuthUserService } from './user-auth.service';
import { LoginRateLimitGuard } from 'src/common/rate-limiters/login-rate.limiter';

@ApiTags('User Authentication')
@Controller('user')
export class UserAuthController {
  constructor(
    private authService: AuthUserService,
    private readonly logger: Logger,
  ) {}

  @ApiOperation({ summary: 'Register User' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully. OTP sent to email.',
  })
  @Post('signup')
  async registerUser(
    @Body() registerDto: RegisterDto,
  ): Promise<RegisterResponseDto> {
    this.logger.log(
      { email: registerDto.email },
      'User signup request received',
    );
    return this.authService.registerUser(registerDto);
  }

  @ApiOperation({ summary: 'Verify User OTP' })
  @ApiBody({ type: OtpDto })
  @ApiResponse({ status: 200, description: 'User verified successfully.' })
  @Post('verify-signup-code')
  verifyUserOtp(@Body() otpDto: OtpDto): Promise<VerifyOtpResponseDto> {
    this.logger.log({
      email: otpDto.email,
      message: 'User OTP verification attempt',
    });
    return this.authService.verifyUser(otpDto);
  }
  @ApiOperation({ summary: 'User Login' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'User login successfully.' })
  @UseGuards(LoginRateLimitGuard)
  @Post('signin')
  async loginUser(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    this.logger.log({
      email: loginDto.email,
      message: 'User signin request received',
    });
    return this.authService.loginUser(loginDto);
  }
}

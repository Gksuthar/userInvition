import {
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';

import { UserInfoResponseDto } from './dto/users.response.dto';
import {  ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserRateLimitGuard } from 'src/common/rate-limiters/user-rate.limiter';
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private logger: Logger,
  ) {}

  @Get()
  @ApiOkResponse({ type: UserInfoResponseDto })
  // @RequirePermission(FEATURES.USER, ACCESS_TYPES.READ, ROLES.SUPER_ADMIN)
  @UseGuards(JwtAuthGuard, UserRateLimitGuard)
  async getUser(@Query('email') email: string): Promise<UserInfoResponseDto> {
    this.logger.log({ email }, 'request received for get user info');
    return this.usersService.getUserInformation(email);
  }
}

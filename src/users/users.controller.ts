import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

import { UserInfoResponseDto } from './dto/users.response.dto';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';
@ApiTags('Users')
@Controller('users')
@ApiBearerAuth()
export class UsersController {
  constructor(
    private usersService: UsersService,
    private logger: Logger,
  ) {}
  @ApiBearerAuth()
  @Get()
  @ApiOkResponse({ type: UserInfoResponseDto })
  @UseGuards(JwtAuthGuard, AdminGuard)
  async getUser(@Query('email') email: string): Promise<UserInfoResponseDto> {
    this.logger.log({ email }, 'request received for get user info');
    return this.usersService.getUserInformation(email);
  }
}

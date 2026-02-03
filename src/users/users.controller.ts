import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';

import { UserInfoResponseDto } from './dto/users.response.dto';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';
import { RequirePermission } from 'src/auth/decorator/require-permission.decorator';
import { ACCESS_TYPES, FEATURES, ROLES } from 'src/utils/roles';
@ApiTags('Users')
@Controller('users')
@ApiBearerAuth()
export class UsersController {
  constructor(
    private usersService: UsersService,
    private logger: Logger,
  ) {}
  @Get()
  @ApiOkResponse({ type: UserInfoResponseDto })
  @RequirePermission(FEATURES.USER, ACCESS_TYPES.READ, ROLES.ADMIN)
  async getUser(@Query('email') email: string): Promise<UserInfoResponseDto> {
    this.logger.log({ email }, 'request received for get user info');
    return this.usersService.getUserInformation(email);
  }
}

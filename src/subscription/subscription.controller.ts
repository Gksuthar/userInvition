import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RequirePermission } from 'src/auth/decorator/require-permission.decorator';
import { SubscriptionCancelResponseDto } from './dto/subscription.cancel.response';
import { SubscriptionService } from './subscription.service';
import { Logger } from 'nestjs-pino';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PermissionGuard } from 'src/auth/guards/permission.guard';
import { ActiveSubscriptionResponseDto } from './dto/ActiveSubscriptionResponseDto';
import { ACCESS_TYPES, FEATURES, ROLES } from 'src/utils/roles';

@ApiTags('Subscription')
@ApiBearerAuth()
@Controller('subscription')
export class SubscriptionController {
  constructor(
    private readonly subscriptionService: SubscriptionService,
    private readonly logger: Logger,
  ) {}

  @Post('active/:userId')
  @ApiOperation({ summary: 'Activate a user subscription (Admin only)' })
  @RequirePermission('subscriptions', 'ACTIVE')
  async activateForUser(
    @Param('userId') userId: string,
  ): Promise<ActiveSubscriptionResponseDto> {
    this.logger.log({ userId }, 'request received to activate subscription');

    const response = await this.subscriptionService.activateForUser(userId);

    this.logger.log(
      { userId, subscriptionId: response.id },
      'subscription activation completed',
    );

    return response;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Cancel a user subscription (Admin only)' })
  @RequirePermission('subscriptions', 'CANCEL', 'admin')
  cancelSubscription(
    @Param('id') userId: string,
    @Req() req: any,
  ): Promise<SubscriptionCancelResponseDto> {
    // Debug log
    this.logger.log({ user: req.user }, 'DEBUG: req.user content');
    const adminId = req.user.userId;
    this.logger.log({ userId, adminId }, 'request received for remove user');
    return this.subscriptionService.cancelSubscription(userId, adminId);
  }
}

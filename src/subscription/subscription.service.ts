import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SubscriptionRepository } from './subscription.repository';
import { SubscriptionCancelResponseDto } from './dto/subscription.cancel.response';
import { Subscription, SubscriptionStatus } from '@prisma/client';
import { Logger } from '@nestjs/common';
import { ActiveSubscriptionResponseDto } from './dto/ActiveSubscriptionResponseDto';

@Injectable()
export class SubscriptionService {
  private readonly logger = new Logger(SubscriptionService.name);

  constructor(
    private readonly subscriptionRepository: SubscriptionRepository,
  ) {}

  async cancelSubscription(
    userId: string,
    adminId?: string,
  ): Promise<SubscriptionCancelResponseDto> {
    this.logger.log(
      { userId, adminId },
      'cancel subscription for user request',
    );

    const subscription =
      await this.subscriptionRepository.findActiveByUserId(userId);

    if (!subscription) {
      this.logger.warn('Subscription not found');
      throw new NotFoundException('Subscription not found');
    }

    if (subscription.status === SubscriptionStatus.CANCEL) {
      this.logger.warn('Subscription already cancelled');

      throw new ConflictException('Subscription already cancelled');
    }

    const updated: Subscription = await this.subscriptionRepository.cancelById(
      subscription.id,
      adminId,
    );
    this.logger.log({ updated }, 'subscription cancelled success');
    return {
      subscriptionId: updated.id,
      cancelledByAdminId: adminId ?? null,
      status: updated.status,
    };
  }

  async activateForUser(
    userId: string,
  ): Promise<ActiveSubscriptionResponseDto> {
    this.logger.log({ userId }, 'activate subscription for user request');

    const subscription =
      await this.subscriptionRepository.activateByUserId(userId);

    const response: ActiveSubscriptionResponseDto = {
      id: subscription.id,
      userId: subscription.userId,
      status: subscription.status,
      startedAt: subscription.created_at,
    };

    this.logger.log(
      { userId, subscriptionId: response.id },
      'activate subscription for user success',
    );

    return response;
  }
}

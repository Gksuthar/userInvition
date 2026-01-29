import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SubscriptionStatus } from './dto/subscription.dto';
import { Subscription } from '@prisma/client';

@Injectable()
export class SubscriptionRepository {
  private readonly logger = new Logger(SubscriptionRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Subscription | null> {
    this.logger.log({ id }, 'find subscription by id request');

    const subscription = await this.prisma.subscription.findUnique({
      where: { id },
    });

    this.logger.log(
      { id, found: !!subscription },
      'find subscription by id result',
    );

    return subscription;
  }

  async cancelById(subscriptionId: string, adminId?: string) {
    this.logger.log(
      { subscriptionId, adminId },
      'cancel subscription by id request',
    );

    const updated = await this.prisma.subscription.update({
      where: { id: subscriptionId },
      data: {
        status: SubscriptionStatus.CANCEL,
        cancelled_at: new Date(),
        cancelled_by_admin_id: adminId ?? null,
      },
    });

    this.logger.log({ subscriptionId, adminId }, 'cancel subscription by id success');

    return updated;
  }

  async findActiveByUserId(userId: string): Promise<Subscription | null> {
    this.logger.log({ userId }, 'find active subscription by user id request');

    const subscription = await this.prisma.subscription.findFirst({
      where: { userId, status: SubscriptionStatus.ACTIVE },
    });

    this.logger.log(
      { userId, subscriptionId: subscription?.id ?? null },
      'find active subscription by user id result',
    );

    return subscription;
  }

  async activateByUserId(userId: string): Promise<Subscription> {
    this.logger.log({ userId }, 'activate subscription by user id request');

    const subscription = await this.prisma.subscription.upsert({
      where: { userId },
      update: {
        status: SubscriptionStatus.ACTIVE,
        cancelled_at: null,
        cancelled_by_admin_id: null,
      },
      create: {
        userId,
        status: SubscriptionStatus.ACTIVE,
      },
    });

    this.logger.log(
      { userId, subscriptionId: subscription.id },
      'activate subscription by user id success',
    );

    return subscription;
  }
}

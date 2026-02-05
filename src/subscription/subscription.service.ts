import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SubscriptionRepository } from './subscription.repository';
import { SubscriptionCancelResponseDto } from './dto/subscription.cancel.response';
import { Subscription, SubscriptionStatus } from '@prisma/client';
import { Logger } from '@nestjs/common';
import { ActiveSubscriptionResponseDto } from './dto/ActiveSubscriptionResponseDto';
import { PrismaService } from 'src/prisma/prisma.service';
import { StripeService } from 'src/stripe/stripe.service';
import { PlanService } from 'src/plan/plan.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class SubscriptionService {
  private readonly logger = new Logger(SubscriptionService.name);

  constructor(
    private readonly subscriptionRepository: SubscriptionRepository,
    private readonly stripeService: StripeService,
    private readonly prisma: PrismaService,
    private readonly planService: PlanService,
    private readonly userService: UsersService,
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

  async activateFreePlan(userId: string, planId: string) {
    this.logger.log({ userId }, 'activating free  for user');
    const subscription = await this.prisma.subscription.create({
      data: {
        user: { connect: { id: userId } },
        plan: { connect: { id: planId } },
        is_one_time: true,
        stripeSubscriptionId: null,
        status: SubscriptionStatus.ACTIVE,
      },
    });

    this.logger.log(
      { subscriptionId: subscription.id },
      'free plan activated successfully',
    );

    return {
      message: 'Free plan activated successfully',
      subscriptionId: subscription.id,
      status: subscription.status,
    };
  }

  async activateForUser(
    userId: string,
    planId: string,
  ): Promise<ActiveSubscriptionResponseDto> {
    this.logger.log({ userId }, 'activate subscription for user request');

    const subscription = await this.subscriptionRepository.activateByUserId(
      userId,
      planId,
    );

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

  async createCheckoutSession(userId: string, planId: string) {
    this.logger.log({ userId, planId }, 'creating checkout session');

    const plan = await this.planService.getPlanByIdService(planId);

    const user = await this.userService.getUserByUserIdService(userId);

    const existingSubscription =
      await this.subscriptionRepository.findActiveByUserId(userId);
    if (existingSubscription) {
      throw new BadRequestException('User already has an active subscription');
    }
    if (plan.isFree) {
      return this.activateFreePlan(userId, planId);
    }

    const session = await this.stripeService.createCheckoutSession({
      mode: plan.is_one_time ? 'payment' : 'subscription',
      customer_email: user.email,
      billing_address_collection: 'required',
      line_items: [
        {
          price: plan.stripePriceId,
          quantity: 1,
        },
      ],
      metadata: {
        userId,
        planId,
      },
      ...(plan.is_one_time ? { customer_creation: 'always' as const } : {}),
      success_url: `https://www.classyshopstore.online/`,
      cancel_url: `https://www.youtube.com/`,
    });

    this.logger.log(
      { sessionId: session.id, url: session.url },
      'checkout session created successfully',
    );

    return {
      url: session.url,
      sessionId: session.id,
    };
  }
}

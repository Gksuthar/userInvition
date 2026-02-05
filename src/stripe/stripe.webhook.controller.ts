import { Controller, Post, Headers, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { StripeService } from './stripe.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { SubscriptionStatus } from '@prisma/client';
import { Logger } from 'nestjs-pino';
import Stripe from 'stripe';
import { ApiExcludeController } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';

@SkipThrottle()
@ApiExcludeController()
@Controller('webhooks/stripe')
export class StripeWebhookController {
  constructor(
    private readonly stripeService: StripeService,
    private readonly prisma: PrismaService,
    private readonly logger: Logger,
  ) {}

  @Post()
  async handleWebhook(
    @Req() req: Request & { rawBody: Buffer },
    @Res() res: Response,
    @Headers('stripe-signature') signature: string,
  ) {
    let event: Stripe.Event;

    try {
      if (!req.rawBody || !signature) {
        this.logger.error({ message: 'Missing rawBody or Stripe signature' });
        return res.status(400).send('Invalid Stripe webhook payload');
      }

      event = this.stripeService.constructWebhookEvent(req.rawBody, signature);
    } catch (err) {
      this.logger.error({ message: err.message });
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
      switch (event.type) {
        case 'checkout.session.completed': {
          const session = event.data.object as Stripe.Checkout.Session;

          const userId = session.metadata?.userId;
          const planId = session.metadata?.planId;

          if (!userId || !planId) break;

          await this.prisma.user.update({
            where: { id: userId },
            data: {
              stripe_customer_id: session.customer as string,
            },
          });

          const isOneTime = session.mode === 'payment';

          await this.prisma.subscription.upsert({
            where: { userId },
            update: {
              plan: { connect: { id: planId } },
              stripeSubscriptionId: isOneTime
                ? null
                : (session.subscription as string),
              is_one_time: isOneTime,
              status: SubscriptionStatus.ACTIVE,
              cancelled_at: null,
            },
            create: {
              user: { connect: { id: userId } },
              plan: { connect: { id: planId } },
              stripeSubscriptionId: isOneTime
                ? null
                : (session.subscription as string),
              is_one_time: isOneTime,
              status: SubscriptionStatus.ACTIVE,
            },
          });

          break;
        }

        case 'invoice.payment_failed': {
          const invoice = event.data.object as any;

          const subscriptionId =
            typeof invoice.subscription === 'string'
              ? invoice.subscription
              : invoice.subscription?.id;

          if (subscriptionId) {
            await this.prisma.subscription.updateMany({
              where: {
                stripeSubscriptionId: subscriptionId,
              },
              data: {
                status: SubscriptionStatus.CANCEL,
                cancelled_at: new Date(),
              },
            });
          }

          break;
        }

        case 'customer.subscription.deleted': {
          const sub = event.data.object as Stripe.Subscription;

          await this.prisma.subscription.updateMany({
            where: {
              stripeSubscriptionId: sub.id,
            },
            data: {
              status: SubscriptionStatus.CANCEL,
              cancelled_at: new Date(),
            },
          });

          break;
        }

        default:
          break;
      }

      return res.json({ received: true });
    } catch (error) {
      this.logger.error({ error: error.message });
      return res.status(500).json({ error: 'Webhook handler failed' });
    }
  }
}

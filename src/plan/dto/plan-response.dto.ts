import { PlanInterval } from '@prisma/client';

export class PlanResponseDto {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: PlanInterval;
  is_one_time: boolean;
  stripeProductId: string;
  stripePriceId: string;

  isActive: boolean;
  isDefault: boolean;
  isFree: boolean;

  createdAt: Date;
  updatedAt: Date;
}

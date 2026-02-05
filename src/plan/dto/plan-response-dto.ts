import { ApiProperty } from '@nestjs/swagger';
import { PlanInterval } from '@prisma/client';

export class PlanResponseDto {
  @ApiProperty({ example: 'plan_123' })
  id: string;

  @ApiProperty({ example: 'Pro Plan' })
  name: string;

  @ApiProperty({
    example: 'Best plan for professionals and teams',
  })
  description: string;

  @ApiProperty({
    example: 999,
    description: 'Price in smallest currency unit (INR)',
  })
  price: number;

  @ApiProperty({
    enum: PlanInterval,
    example: PlanInterval.MONTH,
  })
  interval: PlanInterval;

  @ApiProperty({
    example: false,
    description: 'One-time purchase plan',
  })
  is_one_time: boolean;

  @ApiProperty({
    example: 'prod_TuS7lEP1pGgC9P',
  })
  stripeProductId: string;

  @ApiProperty({
    example: 'price_1SwdDMSD8S8emngrYYLopQ',
  })
  stripePriceId: string;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: false })
  isDefault: boolean;

  @ApiProperty({ example: false })
  isFree: boolean;

  @ApiProperty({
    example: '2026-02-04T10:20:30.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2026-02-04T10:20:30.000Z',
  })
  updatedAt: Date;
}

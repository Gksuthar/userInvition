import { PlanInterval } from '@prisma/client';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePlanDto {
  @ApiProperty({
    example: 'Pro Plan',
    description: 'Name of the subscription plan',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Best plan for professionals and teams',
    description: 'Detailed description of the plan',
  })
  @IsString()
  description: string;

  @ApiProperty({
    example: 999,
    description: 'Price of the plan in smallest currency unit (e.g. INR)',
  })
  @IsInt()
  price: number;

  @ApiPropertyOptional({
    example: true,
    description: 'Whether the plan is a one-time purchase',
  })
  @IsOptional()
  @IsBoolean()
  is_one_time: boolean;

  @ApiProperty({
    example: PlanInterval.MONTH,
    description: 'Billing interval for the plan',
  })
  @IsEnum(PlanInterval)
  interval: PlanInterval;

  @ApiProperty({
    example: 'prod_TuS7lEP1pGgC9P',
    description: 'Stripe product ID',
  })
  @IsString()
  stripeProductId: string;

  @ApiProperty({
    example: 'price_1SwdDMSD8S8emngrYYLopQ',
    description: 'Stripe price ID used to create subscriptions',
  })
  @IsString()
  stripePriceId: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Whether the plan is active',
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    example: false,
    description: 'Marks this plan as default',
  })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;

  @ApiPropertyOptional({
    example: false,
    description: 'Whether this is a free plan',
  })
  @IsOptional()
  @IsBoolean()
  isFree?: boolean;
}

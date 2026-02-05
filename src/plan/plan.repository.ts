import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Plan } from '@prisma/client';
import { CreatePlanDto } from './dto/create-plan.dto';

@Injectable()
export class PlanRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreatePlanDto): Promise<Plan> {
    return this.prisma.plan.create({
      data: {
        name: dto.name,
        description: dto.description,
        is_one_time: dto.is_one_time,
        price: dto.price,
        Interval: dto.interval,
        stripe_product_id: dto.stripeProductId,
        stripe_price_id: dto.stripePriceId,
        is_active: dto.isActive ?? true,
        is_default: dto.isDefault ?? false,
        is_free: dto.isFree ?? false,
      },
    });
  }

  async findById(id: string): Promise<Plan | null> {
    return this.prisma.plan.findUnique({
      where: { id },
    });
  }

  async getFreePlan(): Promise<Plan | null> {
    return this.prisma.plan.findFirst({
      where: { is_free: true },
    });
  }
}

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PlanResponseDto } from './dto/plan-response.dto';
import { CreatePlanDto } from './dto/create-plan.dto';
import { PlanRepository } from './plan.repository';
import { Plan } from '@prisma/client';

@Injectable()
export class PlanService {
  constructor(private readonly planRepo: PlanRepository) {}

  async createPlan(dto: CreatePlanDto): Promise<PlanResponseDto> {
    const plan = await this.planRepo.create(dto);
    return this.toResponse(plan);
  }

  async getPlanByIdService(id: string): Promise<PlanResponseDto> {
    const plan = await this.planRepo.findById(id);

    if (!plan) {
      throw new NotFoundException(`Plan with id ${id} not found`);
    }

    if (!plan.is_active) {
      throw new BadRequestException(`Plan is not active`);
    }
    return this.toResponse(plan);
  }

  private toResponse(plan: Plan): PlanResponseDto {
    return {
      id: plan.id,
      name: plan.name,
      description: plan.description,
      is_one_time: Boolean(plan.is_one_time),
      price: plan.price,
      interval: plan.Interval,
      stripeProductId: plan.stripe_product_id,
      stripePriceId: plan.stripe_price_id,
      isActive: plan.is_active,
      isDefault: plan.is_default,
      isFree: plan.is_free,
      createdAt: plan.created_at,
      updatedAt: plan.updated_at,
    };
  }

  async getFreePlan(): Promise<PlanResponseDto | null> {
    const plan = await this.planRepo.getFreePlan();
    if (!plan) {
      throw new NotFoundException(`free Plan not found`);
    }
    return this.toResponse(plan);
  }
}

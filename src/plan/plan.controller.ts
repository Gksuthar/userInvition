import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PlanResponseDto } from './dto/plan-response.dto';
import { CreatePlanDto } from './dto/create-plan.dto';
import { PlanService } from './plan.service';

@ApiTags('plans')
@Controller('plans')
export class PlanController {
  constructor(private readonly planService: PlanService) {}
  @Post()
  @ApiOkResponse({ type: PlanResponseDto })
  create(@Body() dto: CreatePlanDto): Promise<PlanResponseDto> {
    const plan = this.planService.createPlan(dto);
    return plan;
  }

  @ApiResponse({
    status: 200,
    description: 'Plan fetched successfully',
    type: PlanResponseDto,
  })
  @Get(':id')
  async getPlanById(@Param('id') id: string): Promise<PlanResponseDto> {
    return await this.planService.getPlanByIdService(id);
  }
}

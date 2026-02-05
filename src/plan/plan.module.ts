// plan.module.ts
import { Module } from '@nestjs/common';
import { PlanController } from './plan.controller';
import { PlanService } from './plan.service';
import { PlanRepository } from './plan.repository';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [PlanController],
  providers: [PlanService, PlanRepository, PrismaService],
  exports: [PlanService],
})
export class PlanModule {}

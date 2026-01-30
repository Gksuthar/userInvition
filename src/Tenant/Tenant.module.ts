import { Module } from '@nestjs/common';
import { TenantController } from './Tenant.controller';
import { TenantService } from './Tenant.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TenantRepository } from './Tenant.repository';

@Module({
  imports: [PrismaModule],
  controllers: [TenantController],
  providers: [TenantService, TenantRepository],
  exports: [TenantService],
})
export class TenantModule {}

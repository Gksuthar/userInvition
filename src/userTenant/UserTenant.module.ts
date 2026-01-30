import { PrismaService } from 'src/prisma/prisma.service';
import { UserTenantService } from './UserTenant.service';
import { UserTenantRepository } from './UserTenant.repository';
import { Module } from '@nestjs/common';

@Module({
  providers: [PrismaService, UserTenantService, UserTenantRepository],
  exports: [UserTenantService, UserTenantRepository],
})
export class UserTenantModule {}

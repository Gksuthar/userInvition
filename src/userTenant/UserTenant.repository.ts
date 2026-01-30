import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserTenantDto } from './dto/user-tenant.dto';

@Injectable()
export class UserTenantRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createUserTenant({ user_id, tenant_id }: UserTenantDto) {
    return this.prisma.userTenant.create({
      data: {
        user_id,
        tenant_id,
      },
    });
  }
}

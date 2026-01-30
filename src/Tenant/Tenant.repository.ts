import { Injectable } from '@nestjs/common';
import { Tenant } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TenantRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createTenantRepo({
    name,
    slug,
  }: {
    name: string;
    slug: string;
  }): Promise<Tenant> {
    return await this.prisma.tenant.create({
      data: {
        name,
        slug,
      },
    });
  }

  async findTenantBySlugRepo(slug: string): Promise<Tenant | null> {
    return await this.prisma.tenant.findUnique({
      where: {
        slug,
      },
    });
  }
}

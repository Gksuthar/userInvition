import { Injectable } from '@nestjs/common';
import type { Category } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoryRepository {
  constructor(private prisma: PrismaService) {}

  create({
    name,
    parentId,
    description,
    tenant_id,
  }: {
    name: string;
    parentId?: string;
    description?: string;
    tenant_id: string;
  }): Promise<Category> {
    return this.prisma.category.create({
      data: {
        name,
        parentId: parentId ?? null,
        description: description ?? null,
        tenant_id: tenant_id,
      },
    });
  }
}

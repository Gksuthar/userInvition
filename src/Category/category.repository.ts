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
  }: {
    name: string;
    parentId?: string;
    description?: string;
  }): Promise<Category> {
    return this.prisma.category.create({
      data: {
        name,
        parentId: parentId ?? null,
        description: description ?? null,
      },
    });
  }
}

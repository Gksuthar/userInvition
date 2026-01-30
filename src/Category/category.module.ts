import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CategoryRepository } from './category.repository';
import { CreateCategoryService } from './category.service';
import { CategoryController } from './category.controller';

@Module({
  controllers: [CategoryController],
  providers: [CreateCategoryService, CategoryRepository, PrismaService],
})
export class CategoryModule {}

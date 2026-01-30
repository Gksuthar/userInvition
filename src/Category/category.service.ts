import { Injectable } from '@nestjs/common';
import { CategoryRepository } from './category.repository';
import { CategoryResponseDto } from './dto/category.response.dto';
import { CreateCategoryDto } from './dto/category.dto';

@Injectable()
export class CreateCategoryService {
  constructor(private repo: CategoryRepository) {}

  createCategory(dto: CreateCategoryDto): Promise<CategoryResponseDto> {
    return this.repo.create(dto);
  }
}

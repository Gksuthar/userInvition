import { CreateCategoryService } from './category.service';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateCategoryDto } from './dto/category.dto';
import { CategoryResponseDto } from './dto/category.response.dto';

@Controller('categories')
@ApiTags('categories')
export class CategoryController {
  constructor(private readonly createCategoryService: CreateCategoryService) {}

  @ApiOperation({ summary: 'create category (only admin can create)' })
  @ApiBody({ type: CreateCategoryDto })
  @ApiResponse({ status: 200, description: 'Admin verified successfully.' })
  @Post()
  create(@Body() dto: CreateCategoryDto): Promise<CategoryResponseDto> {
    return this.createCategoryService.createCategory(dto);
  }
}

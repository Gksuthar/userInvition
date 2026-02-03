// dto/create-category.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Electronics' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'All electronic items' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: 'b2f6e8a2-4f9d-4f71-9c4e-2f8a9c9e1234',
    description: 'Parent category ID (null for root category)',
  })
  @IsOptional()
  @IsUUID()
  parentId?: string;

  @ApiProperty({
    example: 'b2f6e8a2-4f9d-4f71-9c4e-2f8a9c9e1234',
    description: 'Tenant ID',
  })
  @IsNotEmpty()
  @IsUUID()
  tenant_id: string;
}

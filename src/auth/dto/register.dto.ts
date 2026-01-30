import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'test@example.com', default: 'test@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123', minLength: 6, default: 'password123' })
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @ApiProperty({ example: 'Test User', default: 'Test User' })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    example: 'amazon',
    description: 'Optional signup slug (partner / invite / campaign)',
  })
  @IsOptional()
  @IsString()
  slug?: string;
}

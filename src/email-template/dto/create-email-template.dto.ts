import { IsString, IsBoolean, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EmailTemplateType } from '../email-template.type';

export class CreateEmailTemplateDto {
  @ApiProperty()
  @IsString()
  name: string;
  
  @ApiProperty()
  @IsString()
  subject: string;

  @ApiProperty()
  @IsString()
  body: string;

  @ApiProperty()
  @IsEnum(EmailTemplateType)
  type: EmailTemplateType;

  
  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  is_default?: boolean;
}
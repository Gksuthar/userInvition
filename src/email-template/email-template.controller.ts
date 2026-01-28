import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { EmailTemplateService } from './email-template.service';
import { CreateEmailTemplateDto } from './dto/create-email-template.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { EmailTemplateResponseDto } from './dto/email-template-response.dto';

@ApiTags('Email Templates')
@Controller('email-template')
export class EmailTemplateController {
  constructor(private readonly emailTemplateService: EmailTemplateService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminGuard)
  create(@Body() createEmailTemplateDto: CreateEmailTemplateDto): Promise<EmailTemplateResponseDto> {
    return this.emailTemplateService.create(createEmailTemplateDto);
  }
}

import { PrismaService } from '../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateEmailTemplateDto } from './dto/create-email-template.dto';
import { EmailTemplateResponseDto } from './dto/email-template-response.dto';
import { Logger } from 'nestjs-pino';
import { EmailTemplateType } from 'generated/prisma';

@Injectable()
export class EmailTemplateService {
  constructor(private prisma: PrismaService, private readonly logger: Logger) { }

  async create(createEmailTemplateDto: CreateEmailTemplateDto): Promise<EmailTemplateResponseDto> {
    return this.prisma.emailTemplate.create({
      data: createEmailTemplateDto,
    });
  }


  async findByType(type: EmailTemplateType): Promise<EmailTemplateResponseDto> {
    const template = await this.prisma.emailTemplate.findUnique({
      where: { type },
    });
    if (!template) {
      this.logger.warn({ type }, 'Email template with type not found');
      throw new Error(`Email template with type "${type}" not found`);
    }
    return template;
  }
}

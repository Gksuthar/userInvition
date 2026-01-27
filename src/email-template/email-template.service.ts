import { PrismaService } from '../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateEmailTemplateDto } from './dto/create-email-template.dto';

@Injectable()
export class EmailTemplateService {
  constructor(private prisma: PrismaService) { }

  async create(createEmailTemplateDto: CreateEmailTemplateDto) {
    return this.prisma.emailTemplate.create({
      data: createEmailTemplateDto,
    });
  }


  async findByType(type: string) {
    return this.prisma.emailTemplate.findUnique({
      where: { type: type as any },
    });
  }

}

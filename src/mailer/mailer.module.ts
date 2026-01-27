import { Module } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { BullQueue } from '../constants/bull-queue.constant';
import { BullModule } from '@nestjs/bull';
import { EmailBullConfigService } from './email-bull-config.service';
import { MailerProcessor } from './mailer.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: BullQueue.MAIL_QUEUE,
    }),
    PrismaModule,
  ],
  providers: [MailerService, EmailBullConfigService, MailerProcessor],
  exports: [MailerService, EmailBullConfigService],
})
export class MailerModule {}

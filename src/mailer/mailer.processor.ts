import { Processor, Process } from '@nestjs/bull';
import type { Job } from 'bull';
import { Injectable, Logger } from '@nestjs/common';
import { BullQueue } from '../constants/bull-queue.constant';
import { MailerService } from './mailer.service';

@Processor(BullQueue.MAIL_QUEUE)
@Injectable()
export class MailerProcessor {
  private readonly logger = new Logger(MailerProcessor.name);

  constructor(private readonly mailerService: MailerService) {}

  @Process('email')
  async handleEmail(job: Job<{ to: string; subject: string; html: string }>) {
    const { to, subject, html } = job.data;

    this.logger.debug(`Processing email job ${job.id} to ${to}`);

    try {
      await this.mailerService.sendMail({ to, subject, html });
    } catch (error) {
      this.logger.error(`Failed to send queued email to ${to}`, error as any);
      throw error;
    }
  }
}

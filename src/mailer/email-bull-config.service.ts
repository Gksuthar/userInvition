import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import type { Queue, JobOptions } from 'bull';
import { BullQueue } from '../constants/bull-queue.constant';

@Injectable()
export class EmailBullConfigService {
  constructor(
    @InjectQueue(BullQueue.MAIL_QUEUE)
    private readonly mailQueue: Queue,
  ) {
    this.mailQueue.setMaxListeners(100);
  }

  async addEmailToQueue(
    to: string,
    subject: string,
    html: string,
    options?: JobOptions,
  ) {
    return this.mailQueue.add('email', { to, subject, html }, options);
  }
}

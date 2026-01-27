import { Injectable } from '@nestjs/common';
import nodemailer, { Transporter } from 'nodemailer';
import { createMailerConfig } from './mailer.config';

@Injectable()
export class MailerService {
  private transporter: Transporter;
  private readonly fromAddress: string;

  constructor() {
    const config = createMailerConfig();
    this.fromAddress = process.env.SMTP_USER ?? '';
    this.transporter = nodemailer.createTransport(config);
  }

  async sendMail(options: { to: string; subject: string; html: string }) {
    try {
      return await this.transporter.sendMail({
        from: this.fromAddress,
        to: options.to,
        subject: options.subject,
        html: options.html,
      });
    } catch (error) {
      console.error('MailerService sendMail error:', error);
      throw error;
    }
  }
}

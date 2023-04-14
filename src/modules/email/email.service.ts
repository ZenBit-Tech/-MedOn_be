import { Injectable } from '@nestjs/common';
import { SentMessageInfo } from 'nodemailer';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  constructor(private email: MailerService, private config: ConfigService) {}

  public sendConfirmationLink(
    to: string,
    link: string,
  ): Promise<SentMessageInfo> {
    return this.email.sendMail({
      to,
      from: this.config.get('EMAIL_SENDER'),
      subject: 'Please confirm your registration in MedOn System',
      template: 'welcome',
      context: {
        link,
      },
    });
  }

  public sendForgetPasswordLink(
    to: string,
    link: string,
  ): Promise<SentMessageInfo> {
    return this.email.sendMail({
      to,
      from: this.config.get('EMAIL_SENDER'),
      subject: 'Please reset your password in MedOn System',
      template: 'reset',
      context: {
        link,
      },
    });
  }
}

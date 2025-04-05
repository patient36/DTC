import { Injectable } from '@nestjs/common';
import {
  SESClient,
  SendEmailCommand,
  SendEmailCommandInput,
} from '@aws-sdk/client-ses';

@Injectable()
export class MailService {
  private sesClient: SESClient;

  constructor() {
    const region = process.env.AWS_REGION;
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

    if (!region || !accessKeyId || !secretAccessKey) {
      throw new Error('Missing AWS SES environment variables');
    }

    this.sesClient = new SESClient({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  async sendEmail(to: string, subject: string, body: string): Promise<void> {
    const params: SendEmailCommandInput = {
      Source: process.env.AWS_SES_SENDER_EMAIL!,
      Destination: {
        ToAddresses: [to],
      },
      Message: {
        Subject: { Data: subject },
        Body: {
          Html: { Data: body },
        },
      },
    };

    try {
      await this.sesClient.send(new SendEmailCommand(params));
      console.log(`Email sent to ${to}`);
    } catch (error) {
      console.error(`Error sending email: ${error.message}`);
      throw error;
    }
  }
}

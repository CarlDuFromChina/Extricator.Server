import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { Message, SMTPClient } from 'emailjs';
import { Repository } from 'typeorm';
import { MailVertification } from './mail-vertification.entity';

@Injectable()
export class EmailService {
  constructor(
    private configService: ConfigService,
    @InjectRepository(MailVertification)
    private mailVertificationReporsitory: Repository<MailVertification>,
  ) {
    this.client = new SMTPClient({
      user: configService.get('EMAIL_USER'),
      password: configService.get('EMAIL_PASSWORD'),
      host: configService.get('EMAIL_HOST'),
      ssl: true,
    });
  }

  private client: SMTPClient;

  async send(text: string, to: string, cc: string, subject: string) {
    const message = await this.client.sendAsync({
      text: text,
      from: this.configService.get('EMAIL_USER'),
      to: to,
      cc: cc,
      subject: subject,
    } as any);
    return message;
  }

  /**
   * 发送邮箱验证
   * @param to 发送邮箱
   */
  async sendVerifyMail(to: string, user_code: string) {
    var id = randomUUID();
    var url = `${this.configService.get('HOST')}/api/user/verify/${id}`;
    var now = new Date();
    now.setHours(now.getHours() + 2);
    var content = `Hi, <br><br>请在两小时内点击该<a href="${url}">链接</a>完成验证`;
    var data = new MailVertification();
    data.user_code = user_code;
    data.id = id;
    data.to_mail = to;
    data.content = content;
    data.expired_time = now;
    data.is_success = false;

    var message = new Message({
      text: content,
      from: this.configService.get('EMAIL_USER'),
      to: to,
      subject: '验证邮箱',
      attachment: [{ data: content, alternative: true }]
    });
    await this.client.sendAsync(message);

    await this.mailVertificationReporsitory.insert(data);
  }

  /**
   * 验证邮箱
   * @param id 
   */
  async verifyMail(id: string): Promise<MailVertification> {
    var data = await this.mailVertificationReporsitory.findOne({ id: id });
    if (data && data.expired_time > new Date()) {
      data.is_success = true;
      await this.mailVertificationReporsitory.save(data);
      return data;
    }
    return null;
  }
}

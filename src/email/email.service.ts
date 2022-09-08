import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { Message, SMTPClient } from 'emailjs';
import { generateRandomNumberCode } from 'src/common/generate';
import { Repository } from 'typeorm';
import { MailVerifyType, MailVertification } from './mail-vertification.entity';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

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

  /**
   * 发送邮件
   * @param text 文本消息(HTML)
   * @param to 收件人
   * @param subject 主题
   * @returns 
   */
  async send(text: string, to: string, subject: string) {
    try {
      var message = new Message({
        text: text,
        from: this.configService.get('EMAIL_USER'),
        to: to,
        subject: subject,
        attachment: [{ data: text, alternative: true }]
      });
      var resp = await this.client.sendAsync(message);
      return resp;
    } catch (error) {
      this.logger.error(error);
    }
  }

  /**
   * 发送邮箱验证
   * @param to 发送邮箱
   */
  async sendVerifyMail(to: string, user_code: string, type: MailVerifyType = MailVerifyType.Link) {
    var id = randomUUID();
    var url = `${this.configService.get('HOST')}/api/user/verify/${id}`;
    var now = new Date();
    now.setHours(now.getHours() + 2);
    var data = new MailVertification();
    switch (type) {
      case MailVerifyType.Mask:
        data.verification_code = generateRandomNumberCode();  
        data.content = `Hi, <br><br>验证码：${data.verification_code}，验证码有效时间为两个小时`;
        break;
      case MailVerifyType.Link:
      default:
        data.content = `Hi, <br><br>请在两小时内点击该<a href="${url}">链接</a>完成验证`;
        break;
    }
    data.user_code = user_code;
    data.id = id;
    data.to_mail = to;
    data.expired_time = now;
    data.is_success = false;
    data.verification_type = type;

    var message = new Message({
      text: data.content,
      from: this.configService.get('EMAIL_USER'),
      to: to,
      subject: '验证邮箱',
      attachment: [{ data: data.content, alternative: true }]
    });
    await this.client.sendAsync(message);

    await this.mailVertificationReporsitory.insert(data);

    return id;
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

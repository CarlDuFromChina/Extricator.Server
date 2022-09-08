import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from "@nestjs/axios";
import { RobotMessage } from './robot-message';

@Injectable()
export class RobotService {
  private readonly logger = new Logger(RobotService.name);
  private robot_url: string;

  constructor(private httpService: HttpService) {
    this.robot_url = 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=d217b9ef-dbd1-4c0c-bd06-3324deab598a';
  }

  async sendText(text: string, mobile?: Array<string>) {
    var data = new RobotMessage();
    data.msgtype = 'text';
    data.text = {
      content: text,
      mentioned_mobile_list: mobile
    };
    var result = await this.httpService.post(this.robot_url, JSON.stringify(data), { headers: { 'Content-Type': 'application/json' }}).toPromise();
    return result;
  }
}

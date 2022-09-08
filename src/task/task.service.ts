import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { isEmpty, isNil } from 'src/common/assert';
import { EmailService } from 'src/email/email.service';
import { JdService } from 'src/jd/jd.service';
import { JuejinService } from 'src/juejin/juejin.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  constructor(
    private jdService: JdService,
    private juejinService: JuejinService,
    private userService: UserService,
    private emailService: EmailService
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async handleCheckin() {
    var users = await this.userService.getAllData();
    for (const user of users) {
      // 掘金
      var data = await this.juejinService.getData(user.code);
      if (!isNil(data)) {
        try {
          if (data.cookie && data.expired_at > new Date()) {
            await this.juejinService.checkin(user.code); // 签到
            // 签到成功消息通知
            if (!isEmpty(user.email) && data.enable_success_notify && user.mail_verified) {
              var message = 'Hi,</br>恭喜你，掘金自动签到成功！';
              this.emailService.send(message, user.email, null, '自动签到消息通知');
            }
          }
        } catch (error) {
          // 签到失败消息通知
          if (!isEmpty(user.email) && data.enable_error_notify && user.mail_verified) {
            var message = 'Hi,</br>很抱歉，掘金自动签到失败了';
            this.emailService.send(message, user.email, null, '自动签到消息通知');
          }
          this.logger.error(error);
        }
        
        // 自动使用免费抽奖
        var resp = await this.juejinService.getLotteryConfig(user.code);
        if (resp.free_count > 0) {
          this.juejinService.draw(user.code, 1);
        }
      }

      // 京东
      try {
        var data = await this.jdService.getData(user.code);
        if (data.cookie && data.expired_at > new Date()) {
          await this.jdService.checkin(user.code);
          // 签到成功消息通知
          if (!isEmpty(user.email) && data.enable_success_notify && user.mail_verified) {
            var message = 'Hi,</br>恭喜你，京东自动签到成功！';
            this.emailService.send(message, user.email, null, '自动签到消息通知');
          }
        }
      } catch (error) {
        // 签到失败消息通知
        if (!isEmpty(user.email) && data.enable_error_notify && user.mail_verified) {
          var message = 'Hi,</br>很抱歉，京东自动签到失败了';
          this.emailService.send(message, user.email, null, '自动签到消息通知');
        }
        this.logger.error(error);
      }
    }
  }

  /**
   * Cookie到期通知
   */
  @Cron(CronExpression.EVERY_HOUR)
  async checkExpiredCookie() {
    var users = await this.userService.getAllData();
    for (const user of users) {
      if (!isEmpty(user.email) && user.mail_verified) {
        // 掘金
        var juejin = await this.juejinService.getData(user.code);
        if (!isNil(juejin) && juejin.enable_cookie_expired_notify && juejin.expired_at) {
          juejin.expired_at.setDate(juejin.expired_at.getDay() - 1);
          if (juejin.expired_at < new Date()) {
            var message = 'Hi,</br>您的掘金Cookie还有不到一天就过期了，请尽快更新！';
            this.emailService.send(message, user.email, null, '自动签到——Cookie过期提醒');
          }
        }
        // 京东
        var jd = await this.jdService.getData(user.code);
        if (!isNil(jd) && jd.enable_cookie_expired_notify && jd.expired_at) {
          jd.expired_at.setDate(jd.expired_at.getDay() - 1);
          if (jd.expired_at < new Date()) {
            var message = 'Hi,</br>您的京东Cookie还有不到一天就过期了，请尽快更新！';
            this.emailService.send(message, user.email, null, '自动签到——Cookie过期提醒');
          }
        }
      }
    }
  }
}

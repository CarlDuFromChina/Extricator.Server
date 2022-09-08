import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { CheckInData } from "./interfaces/checkin-data.interface";
import { JdResponse } from "./interfaces/jd-response.interface";
import { CheckinRecord } from "src/checkin-record/checkin-record.entity";
import { CheckinRecordService } from "src/checkin-record/checkin-record.service";
import { Jd } from "./jd.entity";
import assert, { isEmpty } from "src/common/assert";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class JdService {
  constructor(
    private httpService: HttpService,
    private readonly checkinRecordService: CheckinRecordService,
    @InjectRepository(Jd)
    private readonly jdReporsitory: Repository<Jd>
  ) {}

  /**
   * 获取京东请求头
   * @param code 用户编号
   * @returns 
   */
   private async getConfig(code: string) {
    const data = await this.jdReporsitory.findOne({ user_code: code });
    return {
      withCredentials: true,
      headers: { cookie: data.cookie }
    };
  }

  /**
   * 获取今日签到状态
   * @param code 用户编号
   * @returns 
   */
  async getTodayStatus(code: string) {
    var data = await this.checkinRecordService.getTodayData(code, 'jd');
    if (data && data.status) {
      return true;
    }
    return false;
  }

  /**
   * 签到
   * @param code 用户编码
   * @returns 
   */
  async checkin(code: string) : Promise<JdResponse<CheckInData>> {
    const config = await this.getConfig(code);
    var resp = await this.httpService.post('client.action?functionId=signBeanIndex&appid=ld', null, config).toPromise();
    var result = resp.data as JdResponse<CheckInData>;
    var jdRecord = new CheckinRecord();
    jdRecord.created_at = new Date();
    jdRecord.platform = 'jd';
    jdRecord.platform_name = '京东';
    jdRecord.user_code = code;
    jdRecord.status = result.code === '0';
    jdRecord.error_reason = result.errorMessage;
    await this.checkinRecordService.createOrUpdateData(jdRecord);
    assert.isTrue(!jdRecord.status, '京东签到失败：' + result.errorMessage);
    return result;
  }

  async getData(userCode: string) {
    return this.jdReporsitory.findOne({ where: { user_code: userCode }});
  }

  async createData(data: Jd, userCode: string) {
    if (!isEmpty(data.cookie)) {
      var now = new Date();
      now.setMonth(now.getMonth() + 1); // cookie过期时间为一个月
      data.expired_at = now;
    }
    data.user_code = userCode;
    this.jdReporsitory.insert(data);
  }

  async updateData(data: Jd, userCode: string) {
    var _data = await this.jdReporsitory.findOne({ where: { user_code: userCode }});
    if (!isEmpty(data.cookie)) {
      if (_data.cookie !== data.cookie) {
        var expireDate = new Date();
        expireDate.setMonth(expireDate.getMonth() + 1); // 掘金cookie过期时间为一个月
        data.expired_at = expireDate;
      }
    } else {
      data.expired_at = null;
    }
    data.updated_at = new Date();
    await this.jdReporsitory.save(data);
  }
}
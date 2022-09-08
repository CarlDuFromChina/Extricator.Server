import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CheckinRecord } from 'src/checkin-record/checkin-record.entity';
import { CheckinRecordService } from 'src/checkin-record/checkin-record.service';
import { isEmpty, isNil } from 'src/common/assert';
import { Repository } from 'typeorm';
import { CheckinCounts } from './interfaces/checkin-counts.interface';
import { CheckInData } from './interfaces/checkin-data.interface';
import { DrawData } from './interfaces/draw-data.interface';
import { JuejinResponse } from './interfaces/juejin-response.interface';
import { LotteryConfigData } from './interfaces/lottery-config-data.interface';
import { Award } from './interfaces/lottery.award.interface';
import { Juejin } from './juejin.entity';

@Injectable()
export class JuejinService {
  constructor(
    private readonly httpService: HttpService,
    private readonly checkinRecordService: CheckinRecordService,
    @InjectRepository(Juejin)
    private juejinReporsitory: Repository<Juejin>,
  ) {}

  /**
   * 获取掘金请求头
   * @param code 用户编号
   * @returns
   */
  private async getConfig(code: string) {
    const data = await this.juejinReporsitory.findOne({ user_code: code });
    return {
      withCredentials: true,
      headers: { cookie: data.cookie },
    };
  }

  private async handleReponse<T>(
    res: JuejinResponse<T>,
    resolve?: () => Promise<void>,
    reject?: (msg: string) => Promise<void>,
  ) {
    if (res.err_no.toString() !== '0') {
      if (reject) {
        await reject(res.err_msg);
      }
      throw new InternalServerErrorException(res.err_msg);
    }
    if (resolve) {
      await resolve();
    }
    return res.data;
  }

  /**
   * 获取当前剩余矿石
   * @param code 用户编号
   * @returns
   */
  async getCurPoint(code: string): Promise<number> {
    const config = await this.getConfig(code);
    const res = await this.httpService
      .get('growth_api/v1/get_cur_point', config)
      .toPromise();
    return this.handleReponse(res.data as JuejinResponse<number>);
  }

  /**
   * 获取当前签到情况
   * @param code 用户编号
   * @returns
   */
  async getTodayStatus(code: string): Promise<boolean> {
    const config = await this.getConfig(code);
    const res = await this.httpService
      .get('growth_api/v1/get_today_status', config)
      .toPromise();
    return this.handleReponse(res.data as JuejinResponse<boolean>);
  }

  /**
   * 获取奖池
   * @param code 用户编号
   * @returns
   */
  async getLotteryConfig(code: string): Promise<LotteryConfigData> {
    const config = await this.getConfig(code);
    const res = await this.httpService
      .get('growth_api/v1/lottery_config/get', config)
      .toPromise();
    return this.handleReponse(res.data as JuejinResponse<LotteryConfigData>);
  }

  /**
   * 获取签到总数（连续签到、总签到）
   * @param code 用户编号
   * @returns
   */
  async getCheckinCounts(code: string) {
    const config = await this.getConfig(code);
    const res = await this.httpService
      .get('growth_api/v1/get_counts', config)
      .toPromise();
    return this.handleReponse(res.data as JuejinResponse<CheckinCounts>);
  }

  /**
   * 签到
   * @param code 用户编号
   * @returns
   */
  async checkin(code: string) {
    var juejin = await this.getData(code);
    var juejinRecord = new CheckinRecord();
    juejinRecord.created_at = new Date();
    juejinRecord.platform = 'juejin';
    juejinRecord.platform_name = '掘金';
    juejinRecord.user_code = code;
    var handleSuccess = async () => {
      juejinRecord.status = true;
      await this.checkinRecordService.createOrUpdateData(juejinRecord);
    };
    var handleFail = async (msg: string) => {
      juejinRecord.status = false;
      juejinRecord.error_reason = msg;
      await this.checkinRecordService.createOrUpdateData(juejinRecord);
    };
    if (isNil(juejin)) {
      throw new InternalServerErrorException('未找到该用户');
    }
    if (isEmpty(juejin.cookie)) {
      throw new InternalServerErrorException('未设置Cookie');
    }
    if (juejin.expired_at < new Date()) {
      await handleFail('用户Cookie已过期');
      throw new InternalServerErrorException('用户Cookie已过期');
    }

    const config = await this.getConfig(code);

    await this.queryArticles(code);

    const result = await this.httpService
      .post('growth_api/v1/check_in', null, config)
      .toPromise();

    var resp = await this.handleReponse(
      result.data as JuejinResponse<CheckInData>,
      handleSuccess,
      handleFail,
    );
    return resp;
  }

  /**
   * 查询推荐文章
   * @param code 用户编码
   * @returns 
   */
  async queryArticles(code: string) {
    const config = await this.getConfig(code);
    var param = {
      client_type: 2608,
      cursor: "0",
      id_type: 2,
      limit: 20,
      sort_type: 300
    };
    var result = await this.httpService
      .post('recommend_api/v1/article/recommend_all_feed?aid=2608&uuid=6980253040042001932', param, config)
      .toPromise();
    return result;
  }

  /**
   * 查询大奖获奖信息
   * @param code 用户编码
   * @returns 
   */
  async queryBigAward(code: string) {
    const config = await this.getConfig(code);
    var param = {
      page_no: 1,
      page_size: 5
    };
    var result = await this.httpService
      .post('growth_api/v1/lottery_history/global_big?aid=2608&uuid=6897189016987272712', param, config)
      .toPromise();
    return this.handleReponse(result.data as JuejinResponse<Award>);
  }

  /**
   * 围观大奖
   * @param code 用户编码
   * @returns 
   */
  async dipLucky(code: string) {
    const config = await this.getConfig(code);
    var awards = await this.queryBigAward(code);
    var param = {
      lottery_history_id: awards.lotteries[0].history_id // 获取第一个大奖信息id
    };
    var result = await this.httpService
      .post('growth_api/v1/lottery_lucky/dip_lucky?aid=2608&uuid=6897189016987272712', param, config)
      .toPromise();
    return result.data as JuejinResponse<any>;
  }

  /**
   * 用户抽奖
   * @param code 用户编号
   * @param count 抽奖次数
   * @returns
   */
  async draw(
    code: string,
    count: number,
  ): Promise<Array<JuejinResponse<DrawData>>> {
    const promises = [];
    const config = await this.getConfig(code);
    for (let i = 0; i < count; i++) {
      var promise = this.httpService
        .post('growth_api/v1/lottery/draw', null, config)
        .toPromise()
        .then((resp) => {
          var result = resp.data as JuejinResponse<DrawData>;
          if (result.err_no.toString() !== '0') {
            throw new InternalServerErrorException(result.err_msg);
          }
          return result;
        });
      promises.push(promise);
    }
    return Promise.all(promises);
  }

  /**
   * 全抽
   * @param code 用户编号
   * @returns
   */
  async allin(code: string) {
    var curPoint = await this.getCurPoint(code);
    var count = parseInt((curPoint / 200).toString());
    var result = await this.draw(code, count);
    var prize = {};
    result.forEach((item) => {
      if (item.data.lottery_name in prize) {
        prize[item.data.lottery_name] += 1;
      } else {
        prize[item.data.lottery_name] = 1;
      }
    });
    return prize;
  }

  async getData(userCode: string) {
    return this.juejinReporsitory.findOne({ where: { user_code: userCode } });
  }

  async createData(data: Juejin, userCode: string) {
    if (!isEmpty(data.cookie)) {
      var now = new Date();
      now.setMonth(now.getMonth() + 1); // 掘金cookie过期时间为一个月
      data.expired_at = now;
    }
    data.user_code = userCode;
    this.juejinReporsitory.insert(data);
  }

  async updateData(data: Juejin, userCode: string) {
    var _data = await this.juejinReporsitory.findOne({
      where: { user_code: userCode },
    });
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
    await this.juejinReporsitory.save(data);
  }
}

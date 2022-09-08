import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isEmpty, isNil } from 'src/common/assert';
import { Repository } from 'typeorm';
import { CheckinRecord } from './checkin-record.entity';

@Injectable()
export class CheckinRecordService {
  constructor(
    @InjectRepository(CheckinRecord)
    private checkinRecordRepository: Repository<CheckinRecord>,
  ) {}

  getData(code: string) {
    return this.checkinRecordRepository.findOne(code);
  }

  getTodayData(code: string, platform: string) {
    return this.checkinRecordRepository
      .createQueryBuilder('checkin_record')
      .where('checkin_record.user_code = :code', { code: code })
      .andWhere('checkin_record.platform = :platform', { platform })
      .andWhere('created_at::date = current_date')
      .getOne();
  }

  getAllData(code?: string) {
    if (code) {
      return this.checkinRecordRepository.find({
        where: { user_code: code },
        order: {
          created_at: 'DESC',
        },
      });
    }
    return this.checkinRecordRepository.find();
  }

  /**
   * 创建或更新签到记录
   * @param checkinRecord 签到记录
   */
  async createOrUpdateData(checkinRecord: CheckinRecord) {
    var data = await this.getTodayData(checkinRecord.user_code, checkinRecord.platform); // 获取今天的签到记录
    // 今天没有签到，则插入签到记录
    if (isNil(data)) {
      await this.checkinRecordRepository.insert(checkinRecord);
    } else {
      // 今日签到状态是失败则更新，成功则无需再创建签到记录了
      if (!data.status) {
        checkinRecord.id = data.id;
        await this.checkinRecordRepository.save(checkinRecord);
      }
    }
  }

  deleteData(code: string) {
    return this.checkinRecordRepository.delete(code);
  }
}

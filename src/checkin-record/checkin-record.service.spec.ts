import { Test, TestingModule } from '@nestjs/testing';
import { CheckinRecordService } from './checkin-record.service';

describe('CheckinRecordService', () => {
  let service: CheckinRecordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CheckinRecordService],
    }).compile();

    service = module.get<CheckinRecordService>(CheckinRecordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

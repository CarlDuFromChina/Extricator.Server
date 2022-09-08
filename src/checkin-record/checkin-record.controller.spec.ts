import { Test, TestingModule } from '@nestjs/testing';
import { CheckinRecordController } from './checkin-record.controller';

describe('CheckinRecordController', () => {
  let controller: CheckinRecordController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CheckinRecordController],
    }).compile();

    controller = module.get<CheckinRecordController>(CheckinRecordController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

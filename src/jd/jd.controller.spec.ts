import { Test, TestingModule } from '@nestjs/testing';
import { JdController } from './jd.controller';

describe('JdController', () => {
  let controller: JdController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JdController],
    }).compile();

    controller = module.get<JdController>(JdController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

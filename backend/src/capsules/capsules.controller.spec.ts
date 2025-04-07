import { Test, TestingModule } from '@nestjs/testing';
import { CapsulesController } from './capsules.controller';
import { CapsulesService } from './capsules.service';

describe('CapsulesController', () => {
  let controller: CapsulesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CapsulesController],
      providers: [CapsulesService],
    }).compile();

    controller = module.get<CapsulesController>(CapsulesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { LivreController } from './livre.controller';
import { LivreService } from './livre.service';

describe('LivreController', () => {
  let controller: LivreController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LivreController],
      providers: [LivreService],
    }).compile();

    controller = module.get<LivreController>(LivreController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

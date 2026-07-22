import { Test, TestingModule } from '@nestjs/testing';
import { LivreService } from './livre.service';

describe('LivreService', () => {
  let service: LivreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LivreService],
    }).compile();

    service = module.get<LivreService>(LivreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

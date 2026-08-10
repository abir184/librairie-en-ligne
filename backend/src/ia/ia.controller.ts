import { Controller, Get, Query } from '@nestjs/common';
import { IaService } from './ia.service';

@Controller('ia')
export class IaController {
  constructor(private iaService: IaService) {}

  @Get('test-resume')
  async testResume(
    @Query('titre') titre: string,
    @Query('auteur') auteur: string,
    @Query('description') description: string,
  ) {
    const resume = await this.iaService.genererResume(titre, auteur, description);
    return { resume };
  }
}
import { Controller, Get, Post, Delete, Param, UseGuards, Request } from '@nestjs/common';
import { FavorisService } from './favoris.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('favoris')
@UseGuards(JwtAuthGuard)
export class FavorisController {
  constructor(private favorisService: FavorisService) {}

  @Post(':livreId')
  ajouter(@Request() req, @Param('livreId') livreId: string) {
    return this.favorisService.ajouter(req.user.id, +livreId);
  }

  @Delete(':livreId')
  retirer(@Request() req, @Param('livreId') livreId: string) {
    return this.favorisService.retirer(req.user.id, +livreId);
  }

  @Get()
  findMesFavoris(@Request() req) {
    return this.favorisService.findByClient(req.user.id);
  }
}
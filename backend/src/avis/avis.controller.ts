import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { IsInt, Min, Max, IsOptional, IsString } from 'class-validator';
import { AvisService } from './avis.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

class CreateAvisDto {
  @IsInt()
  livreId: number;

  @IsInt()
  @Min(1)
  @Max(5)
  note: number;

  @IsOptional()
  @IsString()
  commentaire?: string;
}

@Controller('avis')
export class AvisController {
  constructor(private avisService: AvisService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req, @Body() dto: CreateAvisDto) {
    return this.avisService.create(req.user.id, dto.livreId, dto.note, dto.commentaire);
  }

  @Get('livre/:livreId')
  findApprouvesParLivre(@Param('livreId') livreId: string) {
    return this.avisService.findApprouvesParLivre(+livreId);
  }

  @Get('en-attente')
  findEnAttente() {
    return this.avisService.findEnAttente();
  }

  @Patch(':id/approuver')
  approuver(@Param('id') id: string) {
    return this.avisService.approuver(+id);
  }

  @Delete(':id')
  rejeter(@Param('id') id: string) {
    return this.avisService.rejeter(+id);
  }
}
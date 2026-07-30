import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CommandeService } from './commande.service';
import { CreateCommandeDto } from './dto/create-commande.dto';
import { UpdateCommandeDto } from './dto/update-commande.dto';
import { UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('commande')
export class CommandeController {
  constructor(private readonly commandeService: CommandeService) {}

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Post()
create(@Request() req, @Body() createCommandeDto: CreateCommandeDto) {
  return this.commandeService.create(req.user.id, createCommandeDto);
}

  @Get()
  findAll() {
    return this.commandeService.findAll();
  }

  @Get('dashboard-stats')
getDashboardStats() {
  return this.commandeService.getDashboardStats();
}
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commandeService.findOne(+id);
  }
@Patch(':id/statut')
updateStatut(@Param('id') id: string, @Body('statut') statut: string) {
  return this.commandeService.updateStatut(+id, statut);
}
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommandeDto: UpdateCommandeDto) {
    return this.commandeService.update(+id, updateCommandeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commandeService.remove(+id);
  }
}

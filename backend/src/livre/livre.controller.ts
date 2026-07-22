import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LivreService } from './livre.service';
import { CreateLivreDto } from './dto/create-livre.dto';
import { UpdateLivreDto } from './dto/update-livre.dto';

@Controller('livre')
export class LivreController {
  constructor(private readonly livreService: LivreService) {}

  @Post()
  create(@Body() createLivreDto: CreateLivreDto) {
    return this.livreService.create(createLivreDto);
  }

  @Get()
  findAll() {
    return this.livreService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.livreService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLivreDto: UpdateLivreDto) {
    return this.livreService.update(+id, updateLivreDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.livreService.remove(+id);
  }
}

import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LivreService } from './livre.service';
import { CreateLivreDto } from './dto/create-livre.dto';
import { UpdateLivreDto } from './dto/update-livre.dto';
import { UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

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

  @Patch(':id/couverture')
@UseInterceptors(
  FileInterceptor('fichier', {
    storage: diskStorage({
      destination: './uploads/couvertures',
      filename: (req, file, callback) => {
        const nomUnique = `${Date.now()}${extname(file.originalname)}`;
        callback(null, nomUnique);
      },
    }),
    fileFilter: (req, file, callback) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
        return callback(new Error('Seuls les fichiers image (jpg, png, webp) sont autorisés'), false);
      }
      callback(null, true);
    },
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 Mo max
  }),
)
uploadCouverture(@Param('id') id: string, @UploadedFile() fichier: Express.Multer.File) {
  return this.livreService.updateCouverture(+id, `/uploads/couvertures/${fichier.filename}`);
}
}

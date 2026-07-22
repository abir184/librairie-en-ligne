import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategorieDto } from './dto/create-categorie.dto';
import { UpdateCategorieDto } from './dto/update-categorie.dto';

@Injectable()
export class CategorieService {
  constructor(private prisma: PrismaService) {}

  create(createCategorieDto: CreateCategorieDto) {
    return this.prisma.categorie.create({ data: createCategorieDto });
  }

  findAll() {
    return this.prisma.categorie.findMany({ include: { livres: true } });
  }

  findOne(id: number) {
    return this.prisma.categorie.findUnique({
      where: { id },
      include: { livres: true },
    });
  }

  update(id: number, updateCategorieDto: UpdateCategorieDto) {
    return this.prisma.categorie.update({
      where: { id },
      data: updateCategorieDto,
    });
  }

  remove(id: number) {
    return this.prisma.categorie.delete({ where: { id } });
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLivreDto } from './dto/create-livre.dto';
import { UpdateLivreDto } from './dto/update-livre.dto';

@Injectable()
export class LivreService {
  constructor(private prisma: PrismaService) {}

  create(createLivreDto: CreateLivreDto) {
    return this.prisma.livre.create({ data: createLivreDto });
  }

  findAll() {
    return this.prisma.livre.findMany({ include: { categorie: true } });
  }

  findOne(id: number) {
    return this.prisma.livre.findUnique({
      where: { id },
      include: { categorie: true },
    });
  }

  update(id: number, updateLivreDto: UpdateLivreDto) {
    return this.prisma.livre.update({
      where: { id },
      data: updateLivreDto,
    });
  }

  remove(id: number) {
    return this.prisma.livre.delete({ where: { id } });
  }
}

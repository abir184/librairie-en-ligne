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

  findAll(params: { recherche?: string; categorieId?: number; page?: number; limit?: number }) {
  const { recherche, categorieId, page = 1, limit = 20 } = params;

  const where: any = {};

  if (recherche) {
  where.OR = [
    { titre: { contains: recherche, mode: 'insensitive' as const } },
    { auteur: { contains: recherche, mode: 'insensitive' as const } },
  ];
}

  if (categorieId) {
    where.categorieId = categorieId;
  }

  return this.prisma.livre.findMany({
    where,
    include: { categorie: true },
    skip: (page - 1) * limit,
    take: limit,
    orderBy: { createdAt: 'desc' },
  });
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

  updateCouverture(id: number, cheminCouverture: string) {
  return this.prisma.livre.update({
    where: { id },
    data: { couverture: cheminCouverture },
  });
}

  remove(id: number) {
    return this.prisma.livre.delete({ where: { id } });
  }
}

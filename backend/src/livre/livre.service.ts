import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLivreDto } from './dto/create-livre.dto';
import { UpdateLivreDto } from './dto/update-livre.dto';
import { IaService } from '../ia/ia.service';

@Injectable()
export class LivreService {
  constructor(
  private prisma: PrismaService,
  private iaService: IaService,
) {}

  async create(createLivreDto: CreateLivreDto) {
  const livre = await this.prisma.livre.create({ data: createLivreDto });

  // Génération du résumé IA en arrière-plan, sans bloquer la réponse
  this.iaService
    .genererResume(livre.titre, livre.auteur, livre.description || '')
    .then((resume) => {
      if (resume) {
        return this.prisma.livre.update({
          where: { id: livre.id },
          data: { resumeIA: resume },
        });
      }
    })
    .catch(() => {
      // Le livre reste publié même si l'IA échoue, comme prévu dans les règles de gestion
    });

  return livre;
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

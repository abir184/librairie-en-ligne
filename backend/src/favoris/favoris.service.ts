import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FavorisService {
  constructor(private prisma: PrismaService) {}

  async ajouter(clientId: number, livreId: number) {
    const existant = await this.prisma.favori.findUnique({
      where: { clientId_livreId: { clientId, livreId } },
    });

    if (existant) {
      throw new ConflictException('Ce livre est déjà dans vos favoris');
    }

    return this.prisma.favori.create({ data: { clientId, livreId } });
  }

  async retirer(clientId: number, livreId: number) {
    const favori = await this.prisma.favori.findUnique({
      where: { clientId_livreId: { clientId, livreId } },
    });

    if (!favori) {
      throw new NotFoundException('Ce livre n\'est pas dans vos favoris');
    }

    return this.prisma.favori.delete({ where: { id: favori.id } });
  }

  findByClient(clientId: number) {
    return this.prisma.favori.findMany({
      where: { clientId },
      include: { livre: { include: { categorie: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }
}
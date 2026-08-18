import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AvisService {
  constructor(private prisma: PrismaService) {}

  create(clientId: number, livreId: number, note: number, commentaire?: string) {
    return this.prisma.avis.create({
      data: { clientId, livreId, note, commentaire, approuve: false },
    });
  }

  findApprouvesParLivre(livreId: number) {
    return this.prisma.avis.findMany({
      where: { livreId, approuve: true },
      include: { client: { select: { nom: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  findEnAttente() {
    return this.prisma.avis.findMany({
      where: { approuve: false },
      include: { client: { select: { nom: true } }, livre: { select: { titre: true } } },
      orderBy: { createdAt: 'asc' },
    });
  }

  approuver(id: number) {
    return this.prisma.avis.update({
      where: { id },
      data: { approuve: true },
    });
  }

  rejeter(id: number) {
    return this.prisma.avis.delete({ where: { id } });
  }
}

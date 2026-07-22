import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommandeDto } from './dto/create-commande.dto';
import { UpdateCommandeDto } from './dto/update-commande.dto';

@Injectable()
export class CommandeService {
  constructor(private prisma: PrismaService) {}

  async create(createCommandeDto: CreateCommandeDto) {
    return this.prisma.$transaction(async (tx) => {
      const livreIds = createCommandeDto.lignes.map((l) => l.livreId);
      const livres = await tx.livre.findMany({ where: { id: { in: livreIds } } });

      const commande = await tx.commande.create({
        data: {
          clientId: createCommandeDto.clientId,
          lignes: {
            create: createCommandeDto.lignes.map((ligne) => {
              const livre = livres.find((l) => l.id === ligne.livreId);
              if (!livre) throw new NotFoundException(`Livre ${ligne.livreId} introuvable`);
              return {
                livreId: ligne.livreId,
                quantite: ligne.quantite,
                prixUnitaire: livre.prix,
              };
            }),
          },
        },
        include: { lignes: { include: { livre: true } } },
      });

      for (const ligne of createCommandeDto.lignes) {
        await tx.livre.update({
          where: { id: ligne.livreId },
          data: { stock: { decrement: ligne.quantite } },
        });
      }

      return commande;
    });
  }

  findAll() {
    return this.prisma.commande.findMany({
      include: { client: true, lignes: { include: { livre: true } } },
    });
  }

  findOne(id: number) {
    return this.prisma.commande.findUnique({
      where: { id },
      include: { client: true, lignes: { include: { livre: true } } },
    });
  }

  update(id: number, updateCommandeDto: UpdateCommandeDto) {
    return this.prisma.commande.update({
      where: { id },
      data: updateCommandeDto,
    });
  }

  remove(id: number) {
    return this.prisma.commande.delete({ where: { id } });
  }
}

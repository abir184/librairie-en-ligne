import { PrismaService } from '../prisma/prisma.service';
import { CreateCommandeDto } from './dto/create-commande.dto';
import { UpdateCommandeDto } from './dto/update-commande.dto';
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';

@Injectable()
export class CommandeService {
  constructor(private prisma: PrismaService) {}

  async create(clientId: number, createCommandeDto: CreateCommandeDto) {
  return this.prisma.$transaction(async (tx) => {
    const livreIds = createCommandeDto.lignes.map((l) => l.livreId);
    const livres = await tx.livre.findMany({ where: { id: { in: livreIds } } });

    for (const ligne of createCommandeDto.lignes) {
      const livre = livres.find((l) => l.id === ligne.livreId);
      if (!livre) {
        throw new NotFoundException(`Livre ${ligne.livreId} introuvable`);
      }
      if (livre.stock < ligne.quantite) {
        throw new BadRequestException(
          `Stock insuffisant pour "${livre.titre}" (disponible : ${livre.stock}, demandé : ${ligne.quantite})`,
        );
      }
    }

    const commande = await tx.commande.create({
      data: {
        clientId,
        lignes: {
          create: createCommandeDto.lignes.map((ligne) => {
            const livre = livres.find((l) => l.id === ligne.livreId)!;
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
  async getDashboardStats() {
  const debutJour = new Date();
  debutJour.setHours(0, 0, 0, 0);

  const debutMois = new Date();
  debutMois.setDate(1);
  debutMois.setHours(0, 0, 0, 0);

  const commandesDuJour = await this.prisma.commande.count({
    where: { createdAt: { gte: debutJour } },
  });

  const commandesDuMois = await this.prisma.commande.findMany({
    where: {
      createdAt: { gte: debutMois },
      statut: { not: 'annulee' },
    },
    include: { lignes: true },
  });

  const chiffreAffairesMois = commandesDuMois.reduce((total, commande) => {
    const totalCommande = commande.lignes.reduce(
      (sum, ligne) => sum + ligne.prixUnitaire * ligne.quantite,
      0,
    );
    return total + totalCommande;
  }, 0);

  const SEUIL_STOCK_FAIBLE = 20;
  const livresStockFaible = await this.prisma.livre.findMany({
    where: { stock: { lt: SEUIL_STOCK_FAIBLE } },
    select: { id: true, titre: true, stock: true },
    orderBy: { stock: 'asc' },
  });

  return {
    commandesDuJour,
    chiffreAffairesMois: parseFloat(chiffreAffairesMois.toFixed(2)),
    livresStockFaible,
  };
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
async updateStatut(id: number, nouveauStatut: string) {
  return this.prisma.$transaction(async (tx) => {
    const commande = await tx.commande.findUnique({
      where: { id },
      include: { lignes: true },
    });

    if (!commande) {
      throw new NotFoundException(`Commande ${id} introuvable`);
    }

    if (
      nouveauStatut === 'annulee' &&
      commande.statut === 'livree'
    ) {
      throw new BadRequestException(
        'Impossible d\'annuler une commande déjà livrée',
      );
    }

    // Restitution du stock si on passe à "annulee" depuis un autre statut
    if (nouveauStatut === 'annulee' && commande.statut !== 'annulee') {
      for (const ligne of commande.lignes) {
        await tx.livre.update({
          where: { id: ligne.livreId },
          data: { stock: { increment: ligne.quantite } },
        });
      }
    }

    return tx.commande.update({
      where: { id },
      data: { statut: nouveauStatut },
      include: { lignes: { include: { livre: true } } },
    });
  });
}

  remove(id: number) {
    return this.prisma.commande.delete({ where: { id } });
  }
}

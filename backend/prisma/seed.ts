import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcryptjs';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const categoriesData = [
  'Fiction',
  'Non-fiction',
  'Science-fiction',
  'Policier & Thriller',
  'Développement personnel',
  'Biographie',
];

const auteurs = [
  'Amira Trabelsi', 'Karim Bouazizi', 'Salma Jendoubi', 'Youssef Gharbi',
  'Frank Herbert', 'James Clear', 'Taylor Jenkins Reid', 'Matt Haig',
  'Andy Weir', 'Richard Osman', 'Tara Westover', 'Shehan Karunatilaka',
];

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function main() {
  console.log('Nettoyage de la base...');
  await prisma.ligneCommande.deleteMany();
  await prisma.commande.deleteMany();
  await prisma.client.deleteMany();
  await prisma.livre.deleteMany();
  await prisma.categorie.deleteMany();

  console.log('Création des catégories...');
  const categories = await Promise.all(
    categoriesData.map((nom) => prisma.categorie.create({ data: { nom } })),
  );

  console.log('Création de 50 livres...');
  const livres = [];
  for (let i = 1; i <= 50; i++) {
    const livre = await prisma.livre.create({
      data: {
        titre: `Livre de démonstration ${i}`,
        auteur: randomFrom(auteurs),
        prix: parseFloat((10 + Math.random() * 50).toFixed(2)),
        stock: Math.floor(Math.random() * 100),
        description: `Description du livre de démonstration numéro ${i}, généré automatiquement pour les tests.`,
        categorieId: randomFrom(categories).id,
      },
    });
    livres.push(livre);
  }

  console.log('Création de 5 clients de test...');
  const clients = [];
  for (let i = 1; i <= 5; i++) {
    const hashedPassword = await bcrypt.hash('motdepasse123', 10);
    const client = await prisma.client.create({
      data: {
        nom: `Client Test ${i}`,
        email: `client${i}@test.com`,
        password: hashedPassword,
        adresse: `${i} Avenue Habib Bourguiba`,
        telephone: `+216 2${i} 000 00${i}`,
      },
    });
    clients.push(client);
  }

  console.log('Création de commandes d\'exemple...');
  const statuts = ['en_attente', 'validee', 'livree', 'annulee'];
  for (let i = 0; i < 8; i++) {
    const client = randomFrom(clients);
    const livre1 = randomFrom(livres);
    const livre2 = randomFrom(livres);
    await prisma.commande.create({
      data: {
        clientId: client.id,
        statut: randomFrom(statuts),
        lignes: {
          create: [
            { livreId: livre1.id, quantite: 1, prixUnitaire: livre1.prix },
            { livreId: livre2.id, quantite: 2, prixUnitaire: livre2.prix },
          ],
        },
      },
    });
  }

  console.log('Seed terminé : 6 catégories, 50 livres, 5 clients, 8 commandes.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
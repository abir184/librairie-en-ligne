import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LivreModule } from './livre/livre.module';
import { PrismaModule } from './prisma/prisma.module';
import { CategorieModule } from './categorie/categorie.module';
import { ClientModule } from './client/client.module';
import { CommandeModule } from './commande/commande.module';

@Module({
  imports: [LivreModule, PrismaModule, CategorieModule, ClientModule, CommandeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}